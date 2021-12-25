import assert from "assert";

import {
  PathIsSmaller,
  PathIsLonger,
  FunctionDoesNotExist,
} from "../errors/lib/BehaviorSubjectWrapperErrors";
import { SubjectWrapper } from "./SubjectWrapper";

test("subscribeSlice on empty slice with path of size 1", () => {
  const path = [1];
  const subject = new SubjectWrapper();
  subject.subscribeSlice(path, (changes) => {});
  assert(subject.getSlices()[1]);
  //console.log("1st test", subject.getSlices());
});

test("subscribeSlice on empty slice with path of size 2", () => {
  const path = [1, 2];
  const subject = new SubjectWrapper();
  subject.subscribeSlice(path, (changes) => {});
  assert(subject.getSlices()[1]);
  //console.log("2nd test", subject.getSlices());
});

test("subscribeSlice on a slice with existing path and a new path of size 3", () => {
  const path = [1, 2];
  const subject = new SubjectWrapper();
  subject.subscribeSlice(path, (changes) => {});
  assert(subject.getSlices()[1]);
  expect(() => {
    const newPath = [1, 2, 3];
    subject.subscribeSlice(newPath, (changes) => {});
  }).toThrowError(PathIsLonger);
});

test("subscribeSlice on a slice with existing longer path and a new path of size 2", () => {
  const path = [1, 2, 3];
  const subject = new SubjectWrapper();
  subject.subscribeSlice(path, (changes) => {});
  assert(subject.getSlices()[1]);
  expect(() => {
    const newPath = [1, 2];
    subject.subscribeSlice(newPath, (changes) => {});
  }).toThrowError(PathIsSmaller);
});

test("subscribeSlice on an exactly existing slice", () => {
  const path = [1, 2, 3];
  const subject = new SubjectWrapper();
  subject.subscribeSlice(path, (changes) => {});
  assert(subject.getSlices()[1]);
  const newPath = [1, 2, 3];
  subject.subscribeSlice(newPath, (changes) => {});
  assert(subject.getSlices()[1][2][3].length === 2);
});

test("subscribeSlice on a slice with 4 different non conflicting inputs", () => {
  const path1 = [1, 2, 4];
  const subject = new SubjectWrapper();
  subject.subscribeSlice(path1, (changes) => {});
  assert(subject.getSlices()[1][2][4]);

  const path2 = [1, 2, 5];
  subject.subscribeSlice(path2, (changes) => {});
  const path3 = [1, 2, 6];
  subject.subscribeSlice(path3, (changes) => {});
  const path4 = [1, 3];
  subject.subscribeSlice(path4, (changes) => {});
});

//UnSubscribeSlice...........................................................................
test("UnsubscribeSlice Test when A Non-Existent Function is given", () => {
  const test = () => {};
  const test2 = () => {
    console.log();
  };
  const obj = { 1: { 2: { 3: [] } } };
  const path = [1, 2, 3];
  const subject = new SubjectWrapper();
  expect(() => {
    subject.subscribeSlice(path, test);
    subject.unsubscribeSlice(path, test2);
  }).toThrowError(FunctionDoesNotExist);
});
test("UnsubscribeSlice Test when an Existent Function is given", () => {
  var a = 1;
  const test = () => {
    a = 2;
  };

  const obj = { 1: { 2: { 3: [] } } };
  const path = [1, 2, 3];
  const subject = new SubjectWrapper();
  subject.subscribeSlice(path, test);
  assert(a == 2);
  a = 1;
  subject.unsubscribeSlice(path, test);
  assert(a == 1);
});
test("UnsubscribeSlice Test when multiple functions are subscirbed to", () => {
  var a = 1;
  const test = () => {
    a = 2;
  };
  const test2 = () => {
    a = 3;
  };
  const test3 = () => {
    a = 4;
  };

  const obj = { 1: { 2: { 3: [] } } };
  const path = [1, 2, 3];
  const array = [a];
  const subject = new SubjectWrapper();
  subject.subscribeSlice(path, test);
  array.push(a);
  subject.subscribeSlice(path, test2);
  array.push(a);

  subject.subscribeSlice(path, test3);
  array.push(a);
  assert(checkIfSame(array, [1, 2, 3, 4]));
  subject.unsubscribeSlice(path, test);
});
function checkIfSame(array1: any[], array2: any[]) {
  if (array1.length == array2.length) {
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

test("Subscribing Multiple functions then unsubscribing to one of them to ensure that proper unsubscription protocol is in place", () => {
  const obj = { 1: { 2: { 3: [] } } };
  const path = [1, 2, 3];
  const subject = new SubjectWrapper();
  let functionStatus = {
    test1Subscribed: false,

    test2Subscribed: false,

    test3Subscribed: false,
    test4Subscribed: false,
  };
  const test1 = () => {
    functionStatus["test1Subscribed"] = !functionStatus["test1Subscribed"];
  };
  const test2 = () => {
    functionStatus["test2Subscribed"] = !functionStatus["test2Subscribed"];
  };
  const test3 = () => {
    functionStatus["test3Subscribed"] = !functionStatus["test3Subscribed"];
  };
  const test4 = () => {
    functionStatus["test4Subscribed"] = !functionStatus["test4Subscribed"];
  };
  const check = () => {
    return (
      functionStatus["test1Subscribed"] &&
      functionStatus["test2Subscribed"] &&
      functionStatus["test3Subscribed"]
    );
  };

  subject.subscribeSlice(path, test1);
  subject.subscribeSlice(path, test2);
  subject.subscribeSlice(path, test3);
  assert(check);
  subject.unsubscribeSlice(path, test1);
  subject.subscribeSlice(path, test4);

  assert(
    !functionStatus["test2Subscribed"] && !functionStatus["test3Subscribed"]
  );
  assert(!functionStatus["test1Subscribed"]);
});

export {};
