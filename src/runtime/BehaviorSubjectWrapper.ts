import { BehaviorSubject } from "rxjs";
import { first } from "rxjs/operators";
import { createPathIfNotExists } from "../lib/createPathIfNotExists";
import { ObjectVisitor } from "../lib/ObjectVisitor";
import { VisitableObject } from "../lib/VisitableObject";
export const PathIsLonger = "a shorter path already exists in the slice";
export const PathIsSmaller = "a longer path already exists in the slice";

export class BehaviorSubjectWrapper<
  T extends { [key: string | number]: any }
> extends BehaviorSubject<T> {
  private slices: { [key: string | number]: any } = {};
  private SubscriberField = "__sliceSubscribers";
  constructor(v: T) {
    super(v);
    // subscribe to itself to send updates to subscribers of a slice
    this.subscribe((v) => {
      this.sendSliceToSubscribers(v);
    });
  }
  //getSlices() is only for testing purposes
  getSlices() {
    return { ...this.slices };
  }
  subscribeSlice(path: (string | number)[], next: (value: any) => void) {
    let currentObj = this.slices;
    let count = -1;
    // this.slices = {}; path: [1, 2]
    // this.slices = {1}; path: [1, 3]
    while (count < path.length - 1) {
      const visitable = new VisitableObject(currentObj);
      const visitor = new ObjectVisitor({
        enterNonTerminal: () => {
          if (path.length - 2 <= count) {
            throw new Error(PathIsSmaller);
          }
          count++;
          currentObj = currentObj[path[count]];
        },
        enterTerminal: () => {
          if (count < path.length - 2) {
            throw new Error(PathIsLonger);
          }
          // we expect that array exists
          count++;
          currentObj[path[count]].push(next);
        },
      });
      try {
        visitable.visitPath(path, visitor);
      } catch (err: any) {
        if (err.message === PathIsLonger || err.message === PathIsSmaller) {
          throw err;
        }
        currentObj[path[count + 1]] = count < path.length - 2 ? {} : [next];
        currentObj = currentObj[path[count + 1]];
        count++;
      }
    }
  }
  unsubscribeSlice(path: (string | number)[], next: (value: any) => void) {
    const visitable = new VisitableObject(this.slices);
    visitable.visitPath(
      [...path, this.SubscriberField],
      new ObjectVisitor({
        enterTerminal: (key, value, parentObj) => {
          if (value && Array.isArray(value)) {
            const index = value.indexOf(next);
            if (index >= 0) {
              value.splice(index, 1);
            }
          }
        },
      })
    );
  }
  private sendSliceToSubscribers(v: any) {
    const callSliceSubscribers = (path: (string | number)[]) => {
      const visitable = new VisitableObject(this.slices);
      visitable.visitPath(
        [...path, this.SubscriberField],
        new ObjectVisitor({
          enterTerminal: (key, value) => {
            if (Array.isArray(value)) {
              for (let i = 0; i < value.length; i++) {
                if (typeof value[i] === "function") value[i]();
              }
            }
          },
        })
      );
    };

    const visitable = new VisitableObject(v);
    visitable.visit(
      new ObjectVisitor({
        enterTerminal: (key, value, parentObj, pathSoFar) => {
          callSliceSubscribers(pathSoFar);
        },
        enterNonTerminal: (key, value, parentObj, pathSoFar) => {
          callSliceSubscribers(pathSoFar);
        },
      })
    );
  }
}
