/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BaseErrorListener } from "./BaseErrorListener.js";

/**
 * {@inheritDoc}
 *
 * <p>
 * This implementation prints messages to {@link System//err} containing the
 * values of {@code line}, {@code charPositionInLine}, and {@code msg} using
 * the following format.</p>
 *
 * <pre>
 * line <em>line</em>:<em>charPositionInLine</em> <em>msg</em>
 * </pre>
 *
 */
export class ConsoleErrorListener extends BaseErrorListener {
    constructor() {
        super();
    }

    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
        console.error("line " + line + ":" + column + " " + msg);
    }
}


/**
 * Provides a default instance of {@link ConsoleErrorListener}.
 */
ConsoleErrorListener.INSTANCE = new ConsoleErrorListener();
