/**
 * The ObjectVisitor class has methods to be called depending upon the key's value.
 * ObjectVisitor can be extended by other classes which want to store the result
 * while traversing the object.
 */
export class ObjectVisitor {
  route: (string | number)[] = [];
  constructor(
    private handlers: {
      enterTerminal?: (
        key: string | number,
        value: string | number | boolean | any[],
        parentObj: { [key: string | number]: any },
        pathSoFar: (string | number)[]
      ) => void;
      enterNonTerminal?: (
        key: string | number,
        value: { [key: string | number]: any },
        parentObj: { [key: string | number]: any },
        pathSoFar: (string | number)[]
      ) => void;
      exitTerminal?: (
        key: string | number,
        value: string | number | boolean | any[],
        parentObj: { [key: string | number]: any },
        pathSoFar: (string | number)[]
      ) => void;
      exitNonTerminal?: (
        key: string | number,
        value: { [key: string | number]: any },
        parentObj: { [key: string | number]: any },
        pathSoFar: (string | number)[]
      ) => void;
    }
  ) {}
  enterTerminal(
    key: string | number,
    value: string | number | boolean | any[],
    parentObj: { [key: string | number]: any }
  ) {
    this.route.push(key);
    if (this.handlers.enterTerminal) {
      this.handlers.enterTerminal(key, value, parentObj, this.route);
    }
  }
  enterNonTerminal(
    key: string | number,
    value: { [key: string | number]: any },
    parentObj: { [key: string | number]: any }
  ) {
    this.route.push(key);
    if (this.handlers.enterNonTerminal) {
      this.handlers.enterNonTerminal(key, value, parentObj, this.route);
    }
  }
  exitTerminal(
    key: string | number,
    value: string | number | boolean | any[],
    parentObj: { [key: string | number]: any }
  ) {
    this.route.pop();
    if (this.handlers.exitTerminal) {
      this.handlers.exitTerminal(key, value, parentObj, this.route);
    }
  }
  exitNonTerminal(
    key: string | number,
    value: { [key: string | number]: any },
    parentObj: { [key: string | number]: any }
  ) {
    this.route.pop();
    if (this.handlers.exitNonTerminal) {
      this.handlers.exitNonTerminal(key, value, parentObj, this.route);
    }
  }
}
