/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParserRuleContext } from "../ParserRuleContext.js";
import { ErrorNode } from "./ErrorNode.js";
import { TerminalNode } from "./TerminalNode.js";

export declare abstract class ParseTreeListener {
    public visitTerminal(node: TerminalNode): void;
    public visitErrorNode(node: ErrorNode): void;
    public enterEveryRule(ctx: ParserRuleContext): void;
    public exitEveryRule(ctx: ParserRuleContext): void;
}
