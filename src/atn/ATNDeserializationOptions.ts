/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class ATNDeserializationOptions {
    generateRuleBypassTransitions: any;
    readOnly: any;
    verifyATN: any;
    constructor(copyFrom: any) {
        if (copyFrom === undefined) {
            copyFrom = null;
        }
        this.readOnly = false;
        this.verifyATN = copyFrom === null ? true : copyFrom.verifyATN;
        this.generateRuleBypassTransitions = copyFrom === null ? false : copyFrom.generateRuleBypassTransitions;
    }
}

// @ts-expect-error TS(2339): Property 'defaultOptions' does not exist on type '... Remove this comment to see the full error message
ATNDeserializationOptions.defaultOptions = new ATNDeserializationOptions();
// @ts-expect-error TS(2339): Property 'defaultOptions' does not exist on type '... Remove this comment to see the full error message
ATNDeserializationOptions.defaultOptions.readOnly = true;
