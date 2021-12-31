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
import React from "react";
import { Subject } from "rxjs";
import { createGlobalVariable } from "../../../../lib/createGlobalVariable";
import { ObjectVisitor } from "../../../../lib/ObjectVisitor";
import { VisitableObject } from "../../../../lib/VisitableObject";
import { Runtime } from "../../../../runtime/Runtime";
import {
  WebBusEvent,
  WebCreateData,
  WebPatchData,
} from "../../../../runtime/WebBusEvent";
import { DesignElementRegistry } from "../../registry/DesignElementRegistry";
import { AcceptsChild } from "../../types/AcceptsChild";
import { DesignElement } from "../../types/DesignElement";
import { ElementBus } from "../../types/ElementBus";
import { ElementState } from "../../types/ElementState";
import { SerializableElementState } from "../../types/SerializableElementState";
import { ElementStateFactory } from "../ElementStateFactory/ElementStateFactory";

class DesignRuntimeClass {
  private static instance: DesignRuntimeClass = new DesignRuntimeClass();
  private canvasRoot: {
    ref: React.RefObject<HTMLDivElement>;
    bus: Subject<AcceptsChild>;
  } = {
    ref: React.createRef(),
    bus: new Subject<AcceptsChild>(),
  };
  private state: { [ID: string]: ElementState } = {};
  private acceptsChild: string[] = [];
  private constructor() {
    const gen = Runtime.getWebBusEventGenerator();
    for (const webBusEvent of gen) {
      switch (webBusEvent.type) {
        case "CREATE":
          this.handleCreateEvent(webBusEvent);
          break;
        case "PATCH":
          this.handlePatchEvent(webBusEvent);
          break;
        default:
          console.error("unhandled type of event", webBusEvent);
      }
    }
    Runtime.subscribeWebBus({
      next: (v) => {
        switch (v.type) {
          case "CREATE":
            this.handleCreateEvent(v);
            break;
          case "PATCH":
            this.handlePatchEvent(v);
            break;
          default:
            console.error("unhandled type of event", v);
        }
      },
    });
    Runtime.subscribeSessionWebBus({
      next: () => {},
    });
    Runtime.subscribeWebDevBus({
      next: () => {},
    });
  }
  public static getInstance() {
    if (DesignRuntimeClass.instance === undefined) {
      DesignRuntimeClass.instance = new DesignRuntimeClass();
    }
    return DesignRuntimeClass.instance;
  }
  public addElement(ID: string, state: ElementState) {
    this.state[ID] = state;
  }
  public registerChildAcceptor(ID: string) {
    this.acceptsChild.push(ID);
  }
  public deregisterChildAcceptor(ID: string) {
    this.acceptsChild = this.acceptsChild.filter((childID) => {
      return childID !== ID;
    });
  }
  public getChildAcceptors() {
    return [...this.acceptsChild];
  }
  public getState(): { [ID: string]: SerializableElementState } {
    const elementIDs = Object.keys(this.state);
    const stringifiable: { [ID: string]: Partial<ElementState> } = {};
    elementIDs.forEach((elementID) => {
      const elementState = this.state[elementID];
      const stringifiableElement: Partial<ElementState> = { ...elementState };
      delete stringifiableElement.bus;
      delete stringifiableElement.ref;
      stringifiable[elementID] = stringifiableElement;
    });
    const stringifiedState = JSON.stringify(stringifiable);
    return JSON.parse(stringifiedState) as {
      [ID: string]: SerializableElementState;
    };
  }
  public getStateFor(ID: string): SerializableElementState {
    if (this.state[ID]) {
      const stringifiable: Partial<ElementState> = { ...this.state[ID] };
      delete stringifiable.bus;
      delete stringifiable.ref;
      const elementState = JSON.stringify(stringifiable);
      return JSON.parse(elementState) as SerializableElementState;
    } else {
      throw Error("Fetching state for non-existent element with ID" + ID);
    }
  }
  private handleCreateEvent(v: WebBusEvent) {
    // update runtime state
    const payload = v.payload as WebCreateData;
    // TODO: ensure that payload.state!.parent exists
    // it creates an element with default values
    const newElement = ElementStateFactory.create(
      payload.compKey,
      payload.ID,
      payload.state!.parent
    );
    // overriding the default values by the event values
    newElement.state = {
      style: payload.state?.style || {},
      properties: payload.state?.properties || {},
      appearance: payload.state?.appearance || {},
      parent: payload.state?.parent,
      alias: payload.state?.alias,
    };
    this.addElement(payload.ID, newElement);
    // send to parent
    this.wireElement(payload.state!.parent, payload.ID);
  }
  private wireElement(parentID: string, childID: string): void {
    if (parentID === "root") {
      this.canvasRoot.bus.next({ acceptchild: childID });
    } else if (parentID) {
      this.state[parentID].bus.next({
        acceptchild: childID,
      });
    } else {
      throw new Error("parent should have existed already");
    }
  }
  private dewireElement(parentID: string, childID: string): void {
    if (parentID === "root") {
      this.canvasRoot.bus.next({ removechild: childID });
    } else if (parentID) {
      this.state[parentID].bus.next({
        removechild: childID,
      });
    } else {
      throw new Error("parent should have existed already");
    }
  }

  private rewireElement(
    oldParentID: string,
    newParentID: string,
    childID: string
  ) {
    this.dewireElement(oldParentID, childID);
    this.wireElement(newParentID, childID);
  }

  private handlePatchEvent(v: WebBusEvent) {
    // check if parent got updated
    // send removechild to old parent and acceptchild to new parent
    // send element to parent
    const payload = v["payload"] as WebPatchData;
    const keys = Object.keys(payload.slice);
    for (let key of keys) {
      switch (key) {
        case "style":
        case "appearance":
        case "properties":
          if (this.state[payload.ID]["state"][key]) {
            this.state[payload.ID]["state"][key] = {
              ...this.state[payload.ID]["state"][key],
              ...payload.slice[key],
            };
          } else {
            this.state[payload.ID]["state"][key] = {
              ...payload.slice[key],
            };
          }
          this.getBusFor(payload.ID).next({
            state: this.state[payload.ID]["state"],
          });
          break;
        case "parent":
          const newParent = payload.slice.parent;
          const oldParent = this.state[payload.ID].state.parent;
          this.rewireElement(oldParent, newParent, payload.ID);
          break;
      }
    }
  }
  public getBusFor(ID: string): ElementBus {
    return this.state[ID].bus;
  }
  public getRefFor(ID: string): React.RefObject<HTMLElement> {
    return this.state[ID].ref;
  }
  public setCanvasRoot(ref: React.RefObject<HTMLDivElement>) {
    // only ref changes, others are same as previous
    this.canvasRoot.ref = ref;
    // populate canvas
    this.populateCanvas();
  }
  public getCanvasRoot() {
    return { ...this.canvasRoot };
  }
  public patchDevState(ID: string, patch: Partial<ElementState>) {
    const visitable = new VisitableObject(patch);
    visitable.visit(
      new ObjectVisitor({
        enterTerminal: (key, value, parentObj, pathSoFar) => {
          let cur: any = this.state[ID];
          for (let i = 0; i < pathSoFar.length; i++) {
            if (i === pathSoFar.length - 1) {
              cur[pathSoFar[i]] = value;
              break;
            }
            if (cur[pathSoFar[i]] === undefined) {
              cur[pathSoFar[i]] = {};
            }
            cur = cur[pathSoFar[i]];
          }
        },
      })
    );
  }
  /**
   * if record is true than a PatchRequest to backend will be sent
   */
  public patchState(
    ID: string,
    patch: Pick<ElementState, "state">,
    record: boolean = false
  ) {
    const visitable = new VisitableObject(patch);
    visitable.visit(
      new ObjectVisitor({
        enterTerminal: (key, value, parentObj, pathSoFar) => {
          let cur: any = this.state[ID].state;
          for (let i = 0; i < pathSoFar.length; i++) {
            if (i === pathSoFar.length - 1) {
              cur[pathSoFar[i]] = value;
              break;
            }
            if (cur[pathSoFar[i]] === undefined) {
              cur[pathSoFar[i]] = {};
            }
            cur = cur[pathSoFar[i]];
          }
        },
      })
    );
    if (record) {
      Runtime.postPatchEvent({ ID, slice: patch });
    }
  }
  public patchStyle(
    ID: string,
    patch: React.CSSProperties,
    record: boolean = false
  ) {
    const visitable = new VisitableObject(patch);
    visitable.visit(
      new ObjectVisitor({
        enterTerminal: (key, value, parentObj, pathSoFar) => {
          let cur: any = this.state[ID].state.style;
          for (let i = 0; i < pathSoFar.length; i++) {
            if (i === pathSoFar.length - 1) {
              cur[pathSoFar[i]] = value;
              break;
            }
            if (cur[pathSoFar[i]] === undefined) {
              cur[pathSoFar[i]] = {};
            }
            cur = cur[pathSoFar[i]];
          }
        },
      })
    );
    if (record) {
      Runtime.postPatchEvent({ ID, slice: { style: patch } });
    }
  }
  public populateCanvas() {
    // TODO: put reverse into a different function
    const r: { [parent: string]: string[] } = {};
    for (const [key, value] of Object.entries(this.state)) {
      const parent = value.state.parent;
      if (!r[parent]) {
        r[parent] = [];
      }
      r[parent].push(key);
    }
    this.traverseState("root", r);
  }
  private traverseState(
    currNode: string,
    mapping: { [parent: string]: string[] }
  ) {
    const ar = mapping[currNode];
    if (!ar) {
      return;
    }
    // first render the currNode
    // then recursively render all it's child nodes
    for (const value of ar) {
      this.wireElement(currNode, value);
      this.traverseState(value, mapping);
    }
  }

  public registerDesignElement(
    categoryName: string,
    designElementManifest: DesignElement
  ) {
    if (!DesignElementRegistry.getCategoryByName(categoryName)) {
      DesignElementRegistry.registerCategory({
        category: categoryName,
        elements: [designElementManifest],
      });
    } else {
      DesignElementRegistry.registerElement(
        categoryName,
        designElementManifest
      );
    }
  }
}

export const DesignRuntime = createGlobalVariable(
  "DesignRuntime",
  DesignRuntimeClass.getInstance()
);
