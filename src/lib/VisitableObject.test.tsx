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
    ) => {
      console.log(pathSoFar);
    },
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      console.log(pathSoFar);
    },
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
    ) => {
      console.log(pathSoFar);
    },
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      console.log(pathSoFar);
    },
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
    ) => {
      console.log(pathSoFar);
    },
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      console.log(pathSoFar);
    },
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
    ) => {
      console.log(pathSoFar);
    },
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      console.log(pathSoFar);
    },
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
    ) => {
      console.log(pathSoFar);
    },
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      console.log(pathSoFar);
    },
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
      console.log(pathSoFar);
    },
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      console.log(pathSoFar);
    },
  };
  const visitor = new ObjectVisitor(handlers);
  const vistiable = new VisitableObject(obj);
  expect(() => {
    vistiable.visitPath([], visitor);
  }).toThrowError("No path was provided");
});
/////////////////////////////////////// Traverse Function Tests ///////////////////////////////////////

const check_traversed_route = (
  traversed_path: string[],
  logs: string[]
): Boolean => {
  if (traversed_path.length !== logs.length) {
    return false;
  }

  for (let i = 0; i < logs.length; i++) {
    const element = logs[i];
    if (element !== traversed_path[i]) {
      return false;
    }
  }
  return true;
};

test("test traverse-1", () => {
  const logs: string[] = [];
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
      console.log(pathSoFar);
    },
    enterNonTerminal: (
      key: string | number,
      value: { [key: string | number]: any },
      parentObj: { [key: string | number]: any },
      pathSoFar: (string | number)[]
    ) => {
      console.log(pathSoFar);
    },
  };
  const visitor = new ObjectVisitor(handlers);
  const vistiable = new VisitableObject(obj);
  vistiable.traverse(obj, visitor);
});

export {};
