import assert from "assert";

import { ObjectVisitor } from "./ObjectVisitor";
import { VisitableObject } from "./VisitableObject";

const check = (logs: string[]): Boolean => {
  for (let i = 0; i < logs.length; i++) {
    const element = logs[i];
    if (i < logs.length - 1) {
      if (logs[i] !== "non-terminal") {
        return false;
      }
    } else {
      if (logs[i] !== "terminal") {
        return false;
      }
    }
  }
  return true;
};
//Test -1
// Parent Object level 2
//A minimal case was tested in this test.
test("test visitPath-1", () => {
  const logs: string[] = [];
  const obj: { [key: string | number]: any } = { properties: { height: "" } };
  const handlers = {
    enterTerminal: (
      key: string | number,
      value: string | number | boolean | any[],
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {},
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {},
  };
  const visitor = new ObjectVisitor(handlers);
  const vistiable = new VisitableObject(obj);
  vistiable.visitPath(["properties", "height"], visitor);

  assert(check(logs));
});

//Test -2
// Parent Object level 1
//The Terminal value was directly given as the route to the function

test("test visitPath-2", () => {
  const logs: string[] = [];
  const obj: { [key: string | number]: any } = { height: "" };
  const handlers = {
    enterTerminal: (
      key: string | number,
      value: string | number | boolean | any[],
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {},
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {},
  };
  const visitor = new ObjectVisitor(handlers);
  const vistiable = new VisitableObject(obj);
  vistiable.visitPath(["height"], visitor);

  assert(check(logs));
});

//Test 3
// Parent Object Level 5
// A Deeply nested object was taken as Parent Object

test("test visitPath-3", () => {
  const logs: string[] = [];
  const obj: { [key: string | number]: any } = {
    properties: {
      borders: {
        outer_border: {
          color: "red",
        },
      },
    },
  };
  const handlers = {
    enterTerminal: (
      key: string | number,
      value: string | number | boolean | any[],
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {},
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {},
  };
  const visitor = new ObjectVisitor(handlers);
  const vistiable = new VisitableObject(obj);
  vistiable.visitPath(
    ["properties", "borders", "outer_border", "color"],
    visitor
  );

  assert(check(logs));
});

//Test 4
// Parent Object Level 2
// A Non-existent Path was given to the function. An Error was expected.

test("test visitPath-4", () => {
  const logs: string[] = [];
  const obj: { [key: string | number]: any } = {
    properties: {
      borders: {
        outer_border: {
          color: "red",
        },
      },
    },
  };
  const handlers = {
    enterTerminal: (
      key: string | number,
      value: string | number | boolean | any[],
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {},
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {},
  };
  const visitor = new ObjectVisitor(handlers);
  const vistiable = new VisitableObject(obj);
  expect(() => {
    vistiable.visitPath(["color"], visitor);
  }).toThrowError("Path Doesn't Exists");
});

//Test 5
// Parent Object Level 2
// An Empty logs was passed as the path to the function
test("test visitPath-5", () => {
  const logs: string[] = [];
  const obj: { [key: string | number]: any } = {
    properties: {
      borders: {
        outer_border: {
          color: "red",
        },
      },
    },
  };
  const handlers = {
    enterTerminal: (
      key: string | number,
      value: string | number | boolean | any[],
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {},
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {},
  };
  const visitor = new ObjectVisitor(handlers);
  const vistiable = new VisitableObject(obj);
  expect(() => {
    vistiable.visitPath([], visitor);
  }).toThrowError("No path was provided");
});
//Test 6
// Parent Object Level 2
// An logs of both Number and String was given as the path to the function
test("test visitPath-6", () => {
  const logs: string[] = [];
  const obj: { [key: string | number]: any } = {
    properties: {
      borders: {
        outer_border: {
          color: "red",
          2: "random",
        },
      },
    },
  };
  const handlers = {
    enterTerminal: (
      key: string | number,
      value: string | number | boolean | any[],
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      logs.push("terminal");
    },
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      logs.push("non-terminal");
    },
  };
  const visitor = new ObjectVisitor(handlers);
  const vistiable = new VisitableObject(obj);
  vistiable.visitPath(["properties", "borders", "outer_border", 2], visitor);
  assert(check(logs));
});

/////////////////////////////////////// Traverse Function Tests ///////////////////////////////////////
const check_traversed_route = (logs: any[]): Boolean => {
  let last = logs[logs.length - 1];
  if (last.length === 0) {
    return true;
  }
  return false;
};

//Traverse Function Test 1
//A Minimal test to check whether general cases are being handledd corretly or not.

test("test traverse-1", () => {
  const logs: any[] = [];
  const obj: { [key: string | number]: any } = {
    properties: {
      borders: {
        outer_border: {
          color: "red",
        },
      },
      height: "412",
      background_color: {
        primary: "red",
        secondary: "brown",
      },
    },
  };
  const handlers = {
    enterTerminal: (
      key: string | number,
      value: string | number | boolean | any[],
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      logs.push(pathSoFar);
    },
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      logs.push(pathSoFar);
    },
    exitTerminal: (
      key: string | number,
      value: string | number | boolean | any[],
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      logs.push(pathSoFar);
    },
    exitNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      logs.push(pathSoFar);
    },
  };
  const visitor = new ObjectVisitor(handlers);
  const vistiable = new VisitableObject(obj);

  vistiable.traverse(obj, visitor);

  assert(check_traversed_route(logs));
});

//Traverse Function Test 2
//An Empty Object was passed in the function. An Error was expected

test("test traverse-2", () => {
  const logs: any[] = [];
  const obj: any = "Hello There";
  const handlers = {
    enterTerminal: (
      key: string | number,
      value: string | number | boolean | any[],
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      logs.push(pathSoFar);
    },
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      logs.push(pathSoFar);
    },
    exitTerminal: (
      key: string | number,
      value: string | number | boolean | any[],
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      logs.push(pathSoFar);
    },
    exitNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      logs.push(pathSoFar);
    },
  };
  const visitor = new ObjectVisitor(handlers);
  const vistiable = new VisitableObject(obj);

  expect(() => {
    vistiable.traverse(obj, visitor);
  }).toThrowError("Provide a valid path");
});

export {};
