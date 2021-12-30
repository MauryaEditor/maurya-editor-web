import { ReplaySubject, TimestampProvider } from "rxjs";
import { first } from "rxjs/operators";

import { ObjectVisitor } from "../lib/ObjectVisitor";
import { VisitableObject } from "../lib/VisitableObject";
import {
  PathIsSmaller,
  PathIsLonger,
  FunctionDoesNotExist,
  InvalidFunction,
} from "../errors/lib/BehaviorSubjectWrapperErrors";

export class ReplaySubjectWrapper<
  T extends { [key: string | number]: any }
> extends ReplaySubject<T> {
  slices: { [key: string | number]: any } = {};
  constructor(
    _bufferSize?: number | undefined,
    _windowTime?: number | undefined,
    _timestampProvider?: TimestampProvider | undefined
  ) {
    super(_bufferSize, _windowTime, _timestampProvider);
    // subscribe to itself to send updates to subscribers of a slice
    this.subscribe((v) => {
      this.sendSliceToSubscribers(v);
    });
  }
  getSlices() {
    return { ...this.slices };
  }

  subscribeSlice(path: (string | number)[], next: (value: any) => void) {
    let currentObj = this.slices;
    let count = -1;

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
    // send last data to the current subscriber
    const obervable = this.asObservable().pipe(first());
    obervable.subscribe({
      next: (v) => {
        const visitable = new VisitableObject(v);
        visitable.visitPath(
          path,
          new ObjectVisitor({
            enterTerminal: (key, value, parentObj) => {
              next(value);
            },
          })
        );
      },
    });
  }
  unsubscribeSlice(path: (string | number)[], next: (value: any) => void) {
    let currObj = this.slices;
    const visitable = new VisitableObject(currObj);

    visitable.visitPath(
      path,
      new ObjectVisitor({
        enterTerminal: (key, value, parentObj) => {
          if (value && Array.isArray(value)) {
            const index = value.indexOf(next);
            if (index >= 0) {
              value.splice(index, 1);
            } else {
              throw new Error(FunctionDoesNotExist);
            }
          } else {
            throw new Error("Invalid");
          }
        },
      })
    );
  }
  private sendSliceToSubscribers(v: any) {
    const callSliceSubscribers = (path: (string | number)[]) => {
      const visitable = new VisitableObject(this.slices);
      visitable.visitPath(
        [...path],
        new ObjectVisitor({
          enterTerminal: (key, value) => {
            if (Array.isArray(value)) {
              for (let i = 0; i < value.length; i++) {
                if (typeof value[i] === "function") value[i]();
                else {
                  throw new Error(InvalidFunction);
                }
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
      })
    );
  }
}
