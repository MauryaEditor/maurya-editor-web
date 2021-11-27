import { ReplaySubjectWrapper } from "./ReplaySubjectWrapper";
import { Observer } from "rxjs";
import { SubjectWrapper } from "./SubjectWrapper";
import { BehaviorSubjectWrapper } from "./BehaviorSubjectWrapper";

export interface BusPostOptions {
  onAccept?: () => void;
  onReject?: () => {};
}

export class Bus<T> {
  protected postOptions?: BusPostOptions = {};
  private subject:
    | SubjectWrapper<T>
    | ReplaySubjectWrapper<T>
    | BehaviorSubjectWrapper<T>;
  constructor(
    subject:
      | SubjectWrapper<T>
      | ReplaySubjectWrapper<T>
      | BehaviorSubjectWrapper<T>
  ) {
    this.subject = subject;
  }
  subscribe(observer: Partial<Observer<T>>) {
    return this.subject.subscribe(observer);
  }
  subscribeSlice(slice: (string | number)[], observer: Observer<T>) {
    return this.subject.subscribeSlice(slice, observer.next);
  }
  post(event: T, options?: BusPostOptions) {
    this.postOptions = options;
    this.subject.next(event);
  }
  accept() {
    if (this.postOptions?.onAccept) this.postOptions.onAccept();
    // accept/reject can be called only by one subscriber
    this.postOptions = {};
  }
  reject() {
    if (this.postOptions?.onReject) this.postOptions.onReject();
    this.postOptions = {};
  }
}
