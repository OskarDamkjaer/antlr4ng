/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RecognitionException } from "./RecognitionException.js";
import { Parser } from "./Parser.js";
import { Token } from "./Token.js";

/**
 * The interface for defining strategies to deal with syntax errors encountered
 * during a parse by ANTLR-generated parsers. We distinguish between three
 * different kinds of errors:
 *
 * <ul>
 * <li>The parser could not figure out which path to take in the ATN (none of
 * the available alternatives could possibly match)</li>
 * <li>The current input does not match what we were looking for</li>
 * <li>A predicate evaluated to false</li>
 * </ul>
 *
 * Implementations of this interface report syntax errors by calling
 * {@link Parser#notifyErrorListeners}.
 *
 * <p>TODO: what to do about lexers</p>
 */
export declare interface ANTLRErrorStrategy {
    /**
     * Reset the error handler state for the specified {@code recognizer}.
     *
     * @param recognizer the parser instance
     */
    reset(recognizer: Parser): void;

    /**
     * This method is called when an unexpected symbol is encountered during an
     * inline match operation, such as {@link Parser#match}. If the error
     * strategy successfully recovers from the match failure, this method
     * returns the {@link Token} instance which should be treated as the
     * successful result of the match.
     *
     * <p>This method handles the consumption of any tokens - the caller should
     * <em>not</em> call {@link Parser#consume} after a successful recovery.</p>
     *
     * <p>Note that the calling code will not report an error if this method
     * returns successfully. The error strategy implementation is responsible
     * for calling {@link Parser#notifyErrorListeners} as appropriate.</p>
     *
     * @param recognizer the parser instance
     * @throws RecognitionException if the error strategy was not able to
     * recover from the unexpected input symbol
     */
    recoverInline(recognizer: Parser): Token;

    /**
     * This method is called to recover from exception {@code e}. This method is
     * called after {@link #reportError} by the default exception handler
     * generated for a rule method.
     *
     * @see #reportError
     *
     * @param recognizer the parser instance
     * @param e the recognition exception to recover from
     * @throws RecognitionException if the error strategy could not recover from
     * the recognition exception
     */
    recover(recognizer: Parser, e: RecognitionException): void;

    /**
     * This method provides the error handler with an opportunity to handle
     * syntactic or semantic errors in the input stream before they result in a
     * {@link RecognitionException}.
     *
     * <p>The generated code currently contains calls to {@link #sync} after
     * entering the decision state of a closure block ({@code (...)*} or
     * {@code (...)+}).</p>
     *
     * <p>For an implementation based on Jim Idle's "magic sync" mechanism, see
     * {@link DefaultErrorStrategy#sync}.</p>
     *
     * @see DefaultErrorStrategy#sync
     *
     * @param recognizer the parser instance
     * @throws RecognitionException if an error is detected by the error
     * strategy but cannot be automatically recovered at the current state in
     * the parsing process
     */
    sync(recognizer: Parser): void;

    /**
     * This method is called by when the parser successfully matches an input
     * symbol.
     *
     * @param recognizer the parser instance
     */
    reportMatch(recognizer: Parser): void;

    /**
     * Report any kind of {@link RecognitionException}. This method is called by
     * the default exception handler generated for a rule method.
     *
     * @param recognizer the parser instance
     * @param e the recognition exception to report
     */
    reportError(recognizer: Parser, e: RecognitionException): void;
}
