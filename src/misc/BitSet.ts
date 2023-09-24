/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class BitSet {
    data: any;
    constructor() {
        this.data = [];
    }

    clear(index: any) {
        if (index === undefined) {
            this.data = [];
        } else {
            this.resize(index);
            this.data[index >>> 5] &= ~(1 << index);
        }
    }

    or(set: any) {
        const minCount = Math.min(this.data.length, set.data.length);
        let k = 0 | 0;
        for (; k + 7 < minCount; k += 8) {
            this.data[k] |= set.data[k];
            this.data[k + 1] |= set.data[k + 1];
            this.data[k + 2] |= set.data[k + 2];
            this.data[k + 3] |= set.data[k + 3];
            this.data[k + 4] |= set.data[k + 4];
            this.data[k + 5] |= set.data[k + 5];
            this.data[k + 6] |= set.data[k + 6];
            this.data[k + 7] |= set.data[k + 7];
        }

        for (; k < minCount; ++k) {
            this.data[k] |= set.data[k];
        }

        if (this.data.length < set.data.length) {
            this.resize((set.data.length << 5) - 1);
            const c = set.data.length;
            for (let k = minCount; k < c; ++k) {
                this.data[k] = set.data[k];
            }
        }
    }

    get(index: any) {
        return (this.data[index >>> 5] & (1 << index)) !== 0;
    }

    get length() {
        let result = 0;
        const c = this.data.length;
        const w = this.data;
        for (let i = 0; i < c; i++) {
            result += this.bitCount(w[i]);
        }

        return result;
    }

    values() {
        // @ts-expect-error TS(6234): This expression is not callable because it is a 'g... Remove this comment to see the full error message
        const result = new Array(this.length());
        let pos = 0;
        const length = this.data.length;
        for (let k = 0; k < length; ++k) {
            let w = this.data[k];
            while (w != 0) {
                const t = w & -w;
                result[pos++] = (k << 5) + this.bitCount((t - 1) | 0);
                w ^= t;
            }
        }

        return result;
    }

    nextSetBit(value: any) {
        // Iterate over all set bits.
        for (const index of this) {
            // Use the first index > than the specified value index.
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            if (index > value) {
                return index;
            }
        }
    }

    set(index: any) {
        this.resize(index);
        this.data[index >>> 5] |= 1 << index;
    }

    toString() {
        return "{" + this.values().join(", ") + "}";
    }

    resize(index: any) {
        const count = (index + 32) >>> 5;
        for (let i = this.data.length; i < count; i++) {
            this.data[i] = 0;
        }
    }

    bitCount(v: any) { // a.k.a. hamming weight
        v -= (v >>> 1) & 0x55555555;
        v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);

        return (((v + (v >>> 4)) & 0xf0f0f0f) * 0x1010101) >>> 24;
    }

    [Symbol.iterator]() {
        const length = this.data.length;
        let currentIndex = 0;
        let currentWord = this.data[currentIndex];
        const bc = this.bitCount;
        const words = this.data;

        return {
            [Symbol.iterator]() {
                return this;
            },
            next() {
                while (currentIndex < length) {
                    if (currentWord !== 0) {
                        const t = currentWord & -currentWord;
                        const value = (currentIndex << 5) + bc((t - 1) | 0);
                        currentWord ^= t;

                        return { done: false, value };
                    } else {
                        currentIndex++;
                        if (currentIndex < length) {
                            currentWord = words[currentIndex];
                        }
                    }
                }

                return { done: true, value: undefined };
            },
        };
    }
}
