import { ObjectVisitor } from "./ObjectVisitor";

/**
 * The VisitableObject class wraps an object with methods that can be used to
 * traverse the object in a tree like fashion.
 */
export class VisitableObject<T extends { [key: string | number]: any }> {
  constructor(private obj: T) {}
  visit(visitor: ObjectVisitor) {
    this.traverse(this.obj, visitor);
  }
  /**
   * The traverse method will go traverse all the keys in the object
   * in dfs fashion. It will call visitor's enterTerminal when it
   * reaches a key whose value is a primary data/arrays type otherwise enterNonTerminal
   * @param curr object to be traversed
   * @param visitor
   */
  traverse(curr: any, visitor: ObjectVisitor) {
    if (typeof curr === "object" && !Array.isArray(curr)) {
      const keys = Object.keys(curr);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (typeof curr[key] === "object" && !Array.isArray(curr)) {
          visitor.enterNonTerminal(key, curr[key], curr);
        } else {
          visitor.enterTerminal(key, curr[key], curr);
        }
        this.traverse(curr[key], visitor);
        if (typeof curr[key] === "object" && !Array.isArray(curr)) {
          visitor.enterNonTerminal(key, curr[key], curr);
        } else {
          visitor.enterTerminal(key, curr[key], curr);
        }
      }
    }
  }
  /**
   * The visitPath method visits each child object in the path supplied as argument.
   * If the value of the last key is a primary object/array then call visitor.terminal
   * otherwise visitor.nonTerminal.
   * if the last
   * @param path the path to traverse
   * @param visitor
   */
  visitPath(path: (string | number)[], visitor: ObjectVisitor) {
    let curr = this.obj;
    for (let i = 0; i < path.length; i++) {
      if (curr) {
        if (
          typeof curr[path[i]] === "object" &&
          !Array.isArray(curr[path[i]])
        ) {
          visitor.enterNonTerminal(path[i], curr[path[i]], curr);
        } else {
          visitor.enterTerminal(path[i], curr[path[i]], curr);
        }
      }
      curr = curr[path[i]];
    }
  }
}
