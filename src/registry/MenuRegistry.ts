import { Registry } from "./Registry";

export interface MenuItem {
  name: string;
  onclick: () => void;
  description: string;
}

export class MenuRegistry extends Registry<MenuItem> {
  unregisterByName(name: string) {
    const index = this.subject.value.findIndex((item) => {
      return item.name === name;
    });
    this.subject.next([...this.subject.value.splice(index, 1)]);
  }
}
