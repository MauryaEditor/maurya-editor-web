import { BehaviorSubject } from "rxjs";
import { first } from "rxjs/operators";
import { createPathIfNotExists } from "../lib/createPathIfNotExists";
import { ObjectVisitor } from "../lib/ObjectVisitor";
import { VisitableObject } from "../lib/VisitableObject";

export class BehaviorSubjectWrapper<
  T extends { [key: string | number]: any }
> extends BehaviorSubject<T> {
  slices: { [key: string | number]: any } = {};
  private SubscriberField = "__sliceSubscribers";
  constructor(v: T) {
    super(v);
    // subscribe to itself to send updates to subscribers of a slice
    this.subscribe((v) => {
      // this.sendSliceToSubscribers(v);
    });
  }
  subscribeSlice(slice: (string | number)[], next: (value: any) => void) {
    // add slice
    createPathIfNotExists(this.slices, [...slice, this.SubscriberField]);
    // add listener to the slice
    const visitable = new VisitableObject(this.slices);
    visitable.visitPath(
      [...slice, this.SubscriberField],
      new ObjectVisitor({
        terminal: (key, value, parentObj) => {
          if (value === undefined) {
            parentObj[key] = [next];
          } else if (Array.isArray(value)) {
            parentObj[key].push(next);
          } else {
            throw Error("value must have been undefined or an existing array");
          }
        },
      })
    );
    // call next with current value
    const obervable = this.asObservable().pipe(first());
    obervable.subscribe({
      next: (v) => {
        const visitable = new VisitableObject(v);
        visitable.visitPath(
          slice,
          new ObjectVisitor({
            terminal: (key, value, parentObj) => {
              next(value);
            },
            nonTerminal: (key, value, parentObj) => {
              next(value);
            },
          })
        );
      },
    });
    return () => {
      this.unsubscribeSlice(slice, next);
    };
  }
  unsubscribeSlice(slice: (string | number)[], next: (value: any) => void) {
    const visitable = new VisitableObject(this.slices);
    visitable.visitPath(
      [...slice, this.SubscriberField],
      new ObjectVisitor({
        terminal: (key, value, parentObj) => {
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
          terminal: (key, value) => {
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
        terminal: (key, value, parentObj, pathSoFar) => {
          callSliceSubscribers(pathSoFar);
        },
        nonTerminal: (key, value, parentObj, pathSoFar) => {
          callSliceSubscribers(pathSoFar);
        },
      })
    );
  }
}
