/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * This class provides a default implementation of the {@link Vocabulary}
 * interface.
 *
 * @author Sam Harwell
 */
export declare class Vocabulary {
    /* eslint-disable @typescript-eslint/naming-convention */

    /**
     * Gets an empty {@link Vocabulary} instance.
     *
     * <p>
     * No literal or symbol names are assigned to token types, so
     * {@link #getDisplayName(int)} returns the numeric value for all tokens
     * except {@link Token#EOF}.</p>
     */
    public static EMPTY_VOCABULARY: Vocabulary;

    private static readonly EMPTY_NAMES: string[];

    /* eslint-enable @typescript-eslint/naming-convention */

    public readonly maxTokenType: number;

    private readonly literalNames: Array<string | null>;
    private readonly symbolicNames: Array<string | null>;
    private readonly displayNames: Array<string | null>;

    /**
     * Constructs a new instance of {@link Vocabulary} from the specified
     * literal, symbolic, and display token names.
     *
     * @param literalNames The literal names assigned to tokens, or {@code null}
     * if no literal names are assigned.
     * @param symbolicNames The symbolic names assigned to tokens, or
     * {@code null} if no symbolic names are assigned.
     * @param displayNames The display names assigned to tokens, or {@code null}
     * to use the values in {@code literalNames} and {@code symbolicNames} as
     * the source of display names, as described in
     * {@link #getDisplayName(int)}.
     *
     * @see #getLiteralName(int)
     * @see #getSymbolicName(int)
     * @see #getDisplayName(int)
     */
    public constructor(
        literalNames: Array<string | null>,
        symbolicNames: Array<string | null>,
        displayNames?: Array<string | null> | null
    );

    /**
     * Returns a {@link Vocabulary} instance from the specified set of token
     * names. This method acts as a compatibility layer for the single
     * {@code tokenNames} array generated by previous releases of ANTLR.
     *
     * <p>The resulting vocabulary instance returns {@code null} for
     * {@link #getLiteralName(int)} and {@link #getSymbolicName(int)}, and the
     * value from {@code tokenNames} for the display names.</p>
     *
     * @param tokenNames The token names, or {@code null} if no token names are
     * available.
     * @returns A {@link Vocabulary} instance which uses {@code tokenNames} for
     * the display names of tokens.
     */
    public static fromTokenNames(tokenNames: Array<string | null>): Vocabulary;

    public getMaxTokenType(): number;
    public getLiteralName(tokenType: number): string | null;
    public getSymbolicName(tokenType: number): string | null;
    public getDisplayName(tokenType: number): string | null;
    public getLiteralNames(): Array<string | null>;
    public getSymbolicNames(): Array<string | null>;
    public getDisplayNames(): Array<string | null>;
}
