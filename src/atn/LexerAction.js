/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { HashCode } from "../misc/HashCode.js";

export class LexerAction {
    constructor(action) {
        this.actionType = action;
        this.isPositionDependent = false;
    }

    hashCode() {
        const hash = new HashCode();
        this.updateHashCode(hash);
        return hash.finish();
    }

    updateHashCode(hash) {
        hash.update(this.actionType);
    }

    equals(other) {
        return this === other;
    }
}
