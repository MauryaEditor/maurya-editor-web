import assert from "assert";
import {
  BehaviorSubjectWrapper,
  PathIsLonger,
  PathIsSmaller,
} from "./BehaviorSubjectWrapper";

test("subscribeSlice on empty slice with path of size 1", () => {
  const path = [1];
  const subject = new BehaviorSubjectWrapper({ 1: { 2: { 3: {} } } });
  subject.subscribeSlice(path, (changes) => {});
  assert(subject.getSlices()[1]);
  console.log("1st test", subject.getSlices());
});

test("subscribeSlice on empty slice with path of size 2", () => {
  const path = [1, 2];
  const subject = new BehaviorSubjectWrapper({ 1: { 2: { 3: {} } } });
  subject.subscribeSlice(path, (changes) => {});
  assert(subject.getSlices()[1]);
  console.log("2nd test", subject.getSlices());
});

test("subscribeSlice on a slice with existing path and a new path of size 3", () => {
  const path = [1, 2];
  const subject = new BehaviorSubjectWrapper({ 1: { 2: { 3: {} } } });
  subject.subscribeSlice(path, (changes) => {});
  assert(subject.getSlices()[1]);
  expect(() => {
    const newPath = [1, 2, 3];
    subject.subscribeSlice(newPath, (changes) => {});
  }).toThrowError(PathIsLonger);
});

test("subscribeSlice on a slice with existing longer path and a new path of size 2", () => {
  const path = [1, 2, 3];
  const subject = new BehaviorSubjectWrapper({ 1: { 2: { 3: {} } } });
  subject.subscribeSlice(path, (changes) => {});
  assert(subject.getSlices()[1]);
  expect(() => {
    const newPath = [1, 2];
    subject.subscribeSlice(newPath, (changes) => {});
  }).toThrowError(PathIsSmaller);
});

test("subscribeSlice on an exactly existing slice", () => {
  const path = [1, 2, 3];
  const subject = new BehaviorSubjectWrapper({ 1: { 2: { 3: {} } } });
  subject.subscribeSlice(path, (changes) => {});
  assert(subject.getSlices()[1]);
  const newPath = [1, 2, 3];
  subject.subscribeSlice(newPath, (changes) => {});
  assert(subject.getSlices()[1][2][3].length === 2);
});

test("subscribeSlice on a slice with 4 different non conflicting inputs", () => {
  const path1 = [1, 2, 4];
  const subject = new BehaviorSubjectWrapper({ 1: { 2: { 3: {} } } });
  subject.subscribeSlice(path1, (changes) => {});
  assert(subject.getSlices()[1][2][4]);
  console.log(subject.getSlices());
  const path2 = [1, 2, 5];
  subject.subscribeSlice(path2, (changes) => {});
  const path3 = [1, 2, 6];
  subject.subscribeSlice(path3, (changes) => {});
  const path4 = [1, 3];
  subject.subscribeSlice(path4, (changes) => {});
});

export {};
