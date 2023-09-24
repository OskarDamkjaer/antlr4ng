/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { stringHashCode } from "../utils/stringHashCode.js";

export class HashCode {
    count: any;
    hash: any;

    constructor() {
        this.count = 0;
        this.hash = 0;
    }

    update() {
        for (let i = 0; i < arguments.length; i++) {
            const value = arguments[i];
            if (value == null)
                {continue;}
            if (Array.isArray(value))
                // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
                {this.update.apply(this, value);}
            else {
                let k = 0;
                switch (typeof (value)) {
                    case "undefined":
                    case "function":
                        continue;
                    case "number":
                    case "boolean":
                        // @ts-expect-error TS(2322): Type 'number | boolean' is not assignable to type ... Remove this comment to see the full error message
                        k = value;
                        break;
                    case "string":
                        k = stringHashCode(value);
                        break;
                    default:
                        if (value.updateHashCode)
                            {value.updateHashCode(this);}
                        else
                            {console.log("No updateHashCode for " + value.toString());}
                        continue;
                }
                k = k * 0xCC9E2D51;
                k = (k << 15) | (k >>> (32 - 15));
                k = k * 0x1B873593;
                this.count = this.count + 1;
                let hash = this.hash ^ k;
                hash = (hash << 13) | (hash >>> (32 - 13));
                hash = hash * 5 + 0xE6546B64;
                this.hash = hash;
            }
        }
    }

    finish() {
        let hash = this.hash ^ (this.count * 4);
        hash = hash ^ (hash >>> 16);
        hash = hash * 0x85EBCA6B;
        hash = hash ^ (hash >>> 13);
        hash = hash * 0xC2B2AE35;
        hash = hash ^ (hash >>> 16);

        return hash;
    }

    static hashStuff() {
        const hash = new HashCode();
        // @ts-expect-error TS(2345): Argument of type 'IArguments' is not assignable to... Remove this comment to see the full error message
        hash.update.apply(hash, arguments);

        return hash.finish();
    }
}
