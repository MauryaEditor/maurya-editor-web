import assert from "assert";
import { BehaviorSubjectWrapper } from "./BehaviorSubjectWrapper";

test("subscribeSlice on BehaviorSubject", () => {
  class TestBehaviorSubjectWrapper<T> extends BehaviorSubjectWrapper<T> {
    subscribeSlice(slice: (string | number)[], next: (value: any) => void) {
      console.log(super.getSlices());
      return super.subscribeSlice(slice, next);
    }
  }

  const subject = new BehaviorSubjectWrapper({
    properties: { height: { color: "red" } },
  });
  subject.subscribeSlice(["properties"], (changes) => {
    assert(false);
  });
  subject.subscribeSlice(["properties", "height"], (changes) => {
    assert(false);
  });
  subject.subscribeSlice(["properties", "height", "color"], (changes) => {
    assert(changes.color === "blue");
  });
  subject.next({ properties: { height: { color: "blue" } } });
});

export {};
