import { ReplaySubjectWrapper } from "./ReplaySubjectWrapper";
import { Observer } from "rxjs";

export interface BusPostOptions {
  onAccept?: () => void;
  onReject?: () => {};
}

export class Bus<T, U> {
  protected postOptions?: BusPostOptions = {};
  private subject: ReplaySubjectWrapper<T> = new ReplaySubjectWrapper<T>();
  constructor() {}
  subscribe(observer: Observer<T>) {
    return this.subject.subscribe(observer);
  }
  subscribeSlice(slice: (string | number)[], observer: Observer<T>) {
    return this.subject.subscribeSlice(slice, observer.next);
  }
  post(type: U, data: T, options?: BusPostOptions) {
    this.postOptions = options;
    this.subject.next(data);
  }
  accept() {
    if (this.postOptions?.onAccept) this.postOptions.onAccept();
  }
  reject() {
    if (this.postOptions?.onReject) this.postOptions.onReject();
  }
}
