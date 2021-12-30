import { Bus } from "./Bus";
import { SubjectWrapper } from "./SubjectWrapper";

export class SubjectBus<T> extends Bus<T> {
  private events: T[] = [];
  constructor() {
    super(new SubjectWrapper<T>());
    // subject is private, hence, to get the events
    // we will have to subscribe and push each event
    this.subscribe({
      next: (v: T) => {
        this.events.push(v);
      },
    });
  }
  // use a generator to avoid making copy of events array
  *getEventsGenerator(): Generator<T, void, void> {
    for (let i = 0; i < this.events.length; i++) {
      // assume that all properties of T are serializable
      yield this.getEventAt(i);
    }
  }
  getEventAt(index: number) {
    if (index >= this.events.length) throw Error("invalid index");
    // assume that all properties of T are serializable
    return JSON.parse(JSON.stringify(this.events[index]));
  }
}
