/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { standardEqualsFunction } from "../utils/standardEqualsFunction.js";
import { standardHashCodeFunction } from "../utils/standardHashCodeFunction.js";

const HASH_KEY_PREFIX = "h-";

export class HashMap {
    data: any;
    equalsFunction: any;
    hashFunction: any;

    constructor(hashFunction: any, equalsFunction: any) {
        this.data = {};
        this.hashFunction = hashFunction || standardHashCodeFunction;
        this.equalsFunction = equalsFunction || standardEqualsFunction;
    }

    set(key: any, value: any) {
        const hashKey = HASH_KEY_PREFIX + this.hashFunction(key);
        if (hashKey in this.data) {
            const entries = this.data[hashKey];
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                if (this.equalsFunction(key, entry.key)) {
                    const oldValue = entry.value;
                    entry.value = value;

                    return oldValue;
                }
            }
            entries.push({ key, value });

            return value;
        } else {
            this.data[hashKey] = [{ key, value }];

            return value;
        }
    }

    containsKey(key: any) {
        const hashKey = HASH_KEY_PREFIX + this.hashFunction(key);
        if (hashKey in this.data) {
            const entries = this.data[hashKey];
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                if (this.equalsFunction(key, entry.key))
                    {return true;}
            }
        }

        return false;
    }

    get(key: any) {
        const hashKey = HASH_KEY_PREFIX + this.hashFunction(key);
        if (hashKey in this.data) {
            const entries = this.data[hashKey];
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                if (this.equalsFunction(key, entry.key))
                    {return entry.value;}
            }
        }

        return null;
    }

    entries() {
        // @ts-expect-error TS(2550): Property 'flatMap' does not exist on type 'string[... Remove this comment to see the full error message
        return Object.keys(this.data).filter((key) => {return key.startsWith(HASH_KEY_PREFIX);}).flatMap((key: any) => {return this.data[key];}, this);
    }

    getKeys() {
        return this.entries().map((e: any) => {return e.key;});
    }

    getValues() {
        return this.entries().map((e: any) => {return e.value;});
    }

    toString() {
        const ss = this.entries().map((e: any) => {return "{" + e.key + ":" + e.value + "}";});

        return "[" + ss.join(", ") + "]";
    }

    get length() {
        return Object.keys(this.data).filter((key) => {return key.startsWith(HASH_KEY_PREFIX);}).map((key) => {return this.data[key].length;}, this).reduce((accum, item) => {return accum + item;}, 0);
    }
}
