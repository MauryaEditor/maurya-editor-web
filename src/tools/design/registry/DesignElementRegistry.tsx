/**
    Copyright 2021 Quaffles    
 
    This file is part of Maurya Editor.
    Maurya Editor is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
    Maurya Editor is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Observer } from "rxjs";
import { Registry } from "../../../registry/Registry";
import { DesignElement } from "../types/DesignElement";
import { DesignElementCategory } from "../types/DesignElementCategory";
import SectionManifest from "../elements/section/Section";

export class DesignElementRegistryClass extends Registry<DesignElementCategory> {
  subscribe(observer: Partial<Observer<DesignElementCategory[]>>) {
    return this.subject.subscribe(observer);
  }
  /**
   * register category
   * @param category
   * @param element
   */
  registerCategory(category: DesignElementCategory) {
    const index = this.subject.value.findIndex((c) => {
      return c.category === category.category;
    });
    if (index >= 0) {
      throw Error("cannot add duplicate category");
    }
    this.subject.next([...this.subject.value, category]);
  }
  /**
   * adds element to category only if category exists
   * otherwise throws error
   */
  registerElement(category: string, element: DesignElement) {
    const categories = this.subject.value;
    if (this.findElementByKey(element.key)) {
      throw Error("cannot add element with duplicate key");
    }
    const index = categories.findIndex((c) => {
      return c.category === category;
    });
    if (index >= 0) {
      const category = categories[index];
      const newCategory: DesignElementCategory = {
        ...category,
        elements: [...category.elements, element],
      };
      this.subject.next([...categories.splice(index, 1, newCategory)]);
    }
    throw Error("element doesn't exist in the registry");
  }
  /**
   * removes element from registry only if found
   * otherwise throws error
   * @param key
   * @returns
   */
  unregisterElementByKey(key: string) {
    const categories = this.subject.value;
    const indices = this.findElementByKey(key);
    if (indices) {
      const category = categories[indices[0]];
      const elements = category.elements;
      const newElements = elements.splice(indices[1], 1);
      const newDesignCategory: DesignElementCategory = {
        category: category.category,
        elements: newElements,
      };
      categories.splice(indices[0], 1, newDesignCategory);
      this.subject.next([...categories]);
      return;
    }
    throw Error("element doesn't exist in the registry");
  }
  private findElementByKey(key: string): [number, number] | undefined {
    const categories = this.subject.value;
    for (let i = 0; i < categories.length; i++) {
      const elements = categories[i].elements;
      const index = elements.findIndex((element) => {
        return element.key === key;
      });
      if (index >= 0) {
        return [i, index];
      }
    }
  }
}

const LayoutCategory: DesignElementCategory = {
  category: "Layout",
  elements: [SectionManifest],
};

export const DesignElementRegistry = new DesignElementRegistryClass([
  LayoutCategory,
]);
