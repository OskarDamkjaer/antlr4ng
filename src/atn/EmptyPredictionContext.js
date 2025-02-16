/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from "./PredictionContext.js";
import { SingletonPredictionContext } from "./SingletonPredictionContext.js";

export class EmptyPredictionContext extends SingletonPredictionContext {

    constructor() {
        super(null, PredictionContext.EMPTY_RETURN_STATE);
    }

    isEmpty() {
        return true;
    }

    getParent(index) {
        return null;
    }

    getReturnState(index) {
        return this.returnState;
    }

    equals(other) {
        return this === other;
    }

    toString() {
        return "$";
    }
}


PredictionContext.EMPTY = new EmptyPredictionContext();
