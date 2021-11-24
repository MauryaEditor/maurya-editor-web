import { BehaviorSubject } from "rxjs";

export class Registry<T> {
  subject: BehaviorSubject<T[]>;
  constructor(value: T[]) {
    this.subject = new BehaviorSubject<T[]>(value);
  }
  register(value: T) {
    this.subject.next([...this.subject.value, value]);
  }
  unregister(value: T) {
    const index = this.subject.value.indexOf(value);
    this.subject.next(this.subject.value.splice(index, 1));
  }
}
