/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LexerIndexedCustomAction } from './LexerIndexedCustomAction.js';
import { HashCode } from "../misc/HashCode.js";

export class LexerActionExecutor {
    /**
     * Represents an executor for a sequence of lexer actions which traversed during
     * the matching operation of a lexer rule (token).
     *
     * <p>The executor tracks position information for position-dependent lexer actions
     * efficiently, ensuring that actions appearing only at the end of the rule do
     * not cause bloating of the {@link DFA} created for the lexer.</p>
     */
    constructor(lexerActions) {
        this.lexerActions = lexerActions === null ? [] : lexerActions;
        /**
         * Caches the result of {@link //hashCode} since the hash code is an element
         * of the performance-critical {@link LexerATNConfig//hashCode} operation
         */
        this.cachedHashCode = HashCode.hashStuff(lexerActions); // "".join([str(la) for la in
        // lexerActions]))
        return this;
    }

    /**
     * Creates a {@link LexerActionExecutor} which encodes the current offset
     * for position-dependent lexer actions.
     *
     * <p>Normally, when the executor encounters lexer actions where
     * {@link LexerAction//isPositionDependent} returns {@code true}, it calls
     * {@link IntStream//seek} on the input {@link CharStream} to set the input
     * position to the <em>end</em> of the current token. This behavior provides
     * for efficient DFA representation of lexer actions which appear at the end
     * of a lexer rule, even when the lexer rule matches a variable number of
     * characters.</p>
     *
     * <p>Prior to traversing a match transition in the ATN, the current offset
     * from the token start index is assigned to all position-dependent lexer
     * actions which have not already been assigned a fixed offset. By storing
     * the offsets relative to the token start index, the DFA representation of
     * lexer actions which appear in the middle of tokens remains efficient due
     * to sharing among tokens of the same length, regardless of their absolute
     * position in the input stream.</p>
     *
     * <p>If the current executor already has offsets assigned to all
     * position-dependent lexer actions, the method returns {@code this}.</p>
     *
     * @param offset The current offset to assign to all position-dependent
     * lexer actions which do not already have offsets assigned.
     *
     * @return {LexerActionExecutor} A {@link LexerActionExecutor} which stores input stream offsets
     * for all position-dependent lexer actions.
     */
    fixOffsetBeforeMatch(offset) {
        let updatedLexerActions = null;
        for (let i = 0; i < this.lexerActions.length; i++) {
            if (this.lexerActions[i].isPositionDependent &&
                !(this.lexerActions[i] instanceof LexerIndexedCustomAction)) {
                if (updatedLexerActions === null) {
                    updatedLexerActions = this.lexerActions.concat([]);
                }
                updatedLexerActions[i] = new LexerIndexedCustomAction(offset,
                    this.lexerActions[i]);
            }
        }
        if (updatedLexerActions === null) {
            return this;
        } else {
            return new LexerActionExecutor(updatedLexerActions);
        }
    }

    /**
     * Execute the actions encapsulated by this executor within the context of a
     * particular {@link Lexer}.
     *
     * <p>This method calls {@link IntStream//seek} to set the position of the
     * {@code input} {@link CharStream} prior to calling
     * {@link LexerAction//execute} on a position-dependent action. Before the
     * method returns, the input position will be restored to the same position
     * it was in when the method was invoked.</p>
     *
     * @param lexer The lexer instance.
     * @param input The input stream which is the source for the current token.
     * When this method is called, the current {@link IntStream//index} for
     * {@code input} should be the start of the following token, i.e. 1
     * character past the end of the current token.
     * @param startIndex The token start index. This value may be passed to
     * {@link IntStream//seek} to set the {@code input} position to the beginning
     * of the token.
     */
    execute(lexer, input, startIndex) {
        let requiresSeek = false;
        const stopIndex = input.index;
        try {
            for (let i = 0; i < this.lexerActions.length; i++) {
                let lexerAction = this.lexerActions[i];
                if (lexerAction instanceof LexerIndexedCustomAction) {
                    const offset = lexerAction.offset;
                    input.seek(startIndex + offset);
                    lexerAction = lexerAction.action;
                    requiresSeek = (startIndex + offset) !== stopIndex;
                } else if (lexerAction.isPositionDependent) {
                    input.seek(stopIndex);
                    requiresSeek = false;
                }
                lexerAction.execute(lexer);
            }
        } finally {
            if (requiresSeek) {
                input.seek(stopIndex);
            }
        }
    }

    hashCode() {
        return this.cachedHashCode;
    }

    updateHashCode(hash) {
        hash.update(this.cachedHashCode);
    }

    equals(other) {
        if (this === other) {
            return true;
        } else if (!(other instanceof LexerActionExecutor)) {
            return false;
        } else if (this.cachedHashCode != other.cachedHashCode) {
            return false;
        } else if (this.lexerActions.length != other.lexerActions.length) {
            return false;
        } else {
            const numActions = this.lexerActions.length;
            for (let idx = 0; idx < numActions; ++idx) {
                if (!this.lexerActions[idx].equals(other.lexerActions[idx])) {
                    return false;
                }
            }
            return true;
        }
    }

    /**
     * Creates a {@link LexerActionExecutor} which executes the actions for
     * the input {@code lexerActionExecutor} followed by a specified
     * {@code lexerAction}.
     *
     * @param lexerActionExecutor The executor for actions already traversed by
     * the lexer while matching a token within a particular
     * {@link LexerATNConfig}. If this is {@code null}, the method behaves as
     * though it were an empty executor.
     * @param lexerAction The lexer action to execute after the actions
     * specified in {@code lexerActionExecutor}.
     *
     * @return {LexerActionExecutor} A {@link LexerActionExecutor} for executing the combine actions
     * of {@code lexerActionExecutor} and {@code lexerAction}.
     */
    static append(lexerActionExecutor, lexerAction) {
        if (lexerActionExecutor === null) {
            return new LexerActionExecutor([lexerAction]);
        }
        const lexerActions = lexerActionExecutor.lexerActions.concat([lexerAction]);
        return new LexerActionExecutor(lexerActions);
    }
}
