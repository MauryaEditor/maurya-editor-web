import { Registry } from "./Registry";

export interface OptionItem {
  name: string;
  onclick: () => void;
  description: string;
}

export class OptionsRegistry extends Registry<OptionItem> {
  unregisterByName(name: string) {
    const index = this.subject.value.findIndex((item) => {
      return item.name === name;
    });
    this.subject.next([...this.subject.value.splice(index, 1)]);
  }
}
