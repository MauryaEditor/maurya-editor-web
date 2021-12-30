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
import { ReplaySubject, Subject, Subscription } from "rxjs";
import { createGlobalVariable } from "../../../../lib/createGlobalVariable";
import { Runtime } from "../../../../runtime/Runtime";

import { SessionWebBus } from "../../../../runtime/SessionWebBus";
import { WebBus } from "../../../../runtime/WebBus";
import {
  WebBusEvent,
  WebCreateData,
  WebPatchData,
} from "../../../../runtime/WebBusEvent";
import { WebDevBus } from "../../../../runtime/WebDevBus";
import { DEV_ELEMENT_RENDERED } from "../../decorators/PostElementRenderedDecoratot";
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
  private sessionBusSubscription: Subscription;
  private webBusSubscription: Subscription;
  private devBusSubscription: Subscription;
  private constructor() {
    this.webBusSubscription = Runtime.subscribeWebBus({
      next: () => {},
    });
    this.sessionBusSubscription = Runtime.subscribeSessionWebBus({
      next: () => {},
    });
    this.devBusSubscription = Runtime.subscribeWebDevBus({
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
    const stringifiedState = JSON.stringify(this.state); //Check
    return JSON.parse(stringifiedState) as {
      [ID: string]: SerializableElementState;
    };
  }
  public getStateFor(ID: string): { [ID: string]: SerializableElementState } {
    const elementState = JSON.stringify(this.state[ID]); //Check
    return JSON.parse(elementState) as {
      [ID: string]: SerializableElementState;
    }; //Typecast as SerializableElementState
  }
  private handleCreateEvent(v: WebBusEvent) {
    // update runtime state
    const payload = v.payload as WebCreateData;
    // TODO: ensure that payload.state!.parent exists
    this.state[payload.ID] = ElementStateFactory.create(
      payload.compKey,
      payload.ID,
      payload.state!.parent
    );
    this.state[payload.ID].state = {
      style: payload.state?.style || {},
      properties: payload.state?.properties || {},
      appearance: payload.state?.appearance || {},
      parent: payload.state?.parent,
      alias: payload.state?.alias,
    };
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
          if (this.getState()[payload.ID]["state"][key]) {
            this.getState()[payload.ID]["state"][key] = {
              ...this.getState()[payload.ID]["state"][key],
              ...payload.slice[key],
            };
          } else {
            this.getState()[payload.ID]["state"][key] = {
              ...payload.slice[key],
            };
          }
          this.getBusFor(payload.ID).next({
            state: this.getState()[payload.ID]["state"],
          });
          break;
        case "parent":
          const newParent = payload.slice.parent;
          // const newParentBus =
          //   newParent === "root"
          //     ? this.getCanvasRoot().bus
          //     : this.getState()[newParent].bus;
          const oldParent = this.getState()[payload.ID].state.parent;
          // const oldParentBus =
          //   oldParent === "root"
          //     ? this.getCanvasRoot().bus
          //     : this.getState()[oldParent].bus;
          // this.getState()[payload.ID].state.parent = newParent;

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
  /**
   * if record is true than a PatchRequest to backend will be sent
   */
  public patchState(
    ID: string,
    patch: Pick<ElementState, "state">,
    record: boolean = false
  ) {
    this.getState()[ID].state = {
      ...this.getState()[ID].state,
      ...patch,
    };
    if (record) {
      Runtime.postPatchEvent({ ID, slice: patch });
    }
  }
  public patchStyle(
    ID: string,
    patch: React.CSSProperties,
    record: boolean = false
  ) {
    this.getState()[ID].state.style = {
      ...this.getState()[ID].state.style,
      ...patch,
    };
    if (record) {
      Runtime.postPatchEvent({ ID, slice: { style: patch } });
    }
  }

  public populateCanvas() {
    var r: { [parent: string]: string[] } = {};
    for (const [key, value] of Object.entries(this.state)) {
      var parent = value.state.parent;
      if (!r[parent]) {
        r[parent] = [];
      }
      r[parent].push(key);
    }
    this.traverseState("root", r);
  }
  private traverseState(node: string, mapping: { [parent: string]: string[] }) {
    var ar = mapping[node];
    for (const value in ar) {
      if (!mapping[value]) {
        this.wireElement(node, value);
      } else {
        this.traverseState(value, mapping);
      }
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
  /**
   * if record is true than a PatchRequest to backend will be sent
   */
  public static patchState(
    ID: string,
    patch: Pick<ElementState, "state">,
    record: boolean = false
  ) {
    DesignRuntime.getState()[ID].state = {
      ...DesignRuntime.getState()[ID].state,
      ...patch,
    };
    if (record) {
      Runtime.postPatchEvent({ ID, slice: patch });
    }
  }
  public static patchStyle(
    ID: string,
    patch: React.CSSProperties,
    record: boolean = false
  ) {
    DesignRuntime.getState()[ID].state.style = {
      ...DesignRuntime.getState()[ID].state.style,
      ...patch,
    };
    if (record) {
      Runtime.postPatchEvent({ ID, slice: { style: patch } });
    }
  }
}

export const DesignRuntime = createGlobalVariable(
  "DesignRuntime",
  DesignRuntimeClass.getInstance()
);
