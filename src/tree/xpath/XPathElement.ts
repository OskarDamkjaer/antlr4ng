/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class XPathElement {
 invert: any;
 nodeName: any;
 /**
  * Construct element like `/ID` or `ID` or `/*` etc...
  * op is null if just node
  *
  * @param nodeName
  */
 constructor(nodeName: any) {
     this.nodeName = nodeName;
     this.invert = false;
 }

 /**
  * Given tree rooted at `t` return all nodes matched by this path
  * element.
  *
  * @param t
  */
 evaluate(t: any) { }

 toString() {
     const inv = this.invert ? "!" : "";
     const className = Object.constructor.name;

     return className + "[" + inv + this.nodeName + "]";
 }
}
