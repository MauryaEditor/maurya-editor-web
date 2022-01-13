import assert from "assert";
import { Subject } from "rxjs";

import {
  PathIsSmaller,
  PathIsLonger,
  FunctionDoesNotExist,
} from "../../errors/lib/BehaviorSubjectWrapperErrors";
import { SubjectWrapper } from "../../runtime/SubjectWrapper";

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
  subject.next({ 1: { 2: { 3: "" } } });
  assert(a == 2);
  a = 1;
  subject.unsubscribeSlice(path, test);
  subject.next({ 1: { 2: { 3: "" } } });
  assert(a == 1);
});
test("UnsubscribeSlice Test when multiple functions are subscirbed to", () => {
  var a = 1;
  let array = [a];
  var b = new Subject<number>();
  b.subscribe({
    next: (v: number) => {
      array.push(v);
    },
  });
  const test = () => {
    b.next(2);
  };
  const test2 = () => {
    b.next(3);
  };
  const test3 = () => {
    b.next(4);
  };

  const obj = { 1: { 2: { 3: [] } } };
  const path = [1, 2, 3];

  const subject = new SubjectWrapper();
  subject.subscribeSlice(path, test);

  subject.subscribeSlice(path, test2);

  subject.subscribeSlice(path, test3);
  subject.next({ 1: { 2: { 3: "" } } });
  assert(checkIfSame(array, [1, 2, 3, 4]));
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



export {};
