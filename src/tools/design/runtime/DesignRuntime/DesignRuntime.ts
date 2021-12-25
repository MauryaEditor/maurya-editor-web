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
import { PostLinkEvent, PostPatchEvent } from "../../../../runtime/commands";
import { SessionWebBus } from "../../../../runtime/SessionWebBus";
import { WebBus } from "../../../../runtime/WebBus";
import {
  WebBusEvent,
  WebCreateData,
  WebPatchData,
} from "../../../../runtime/WebBusEvent";
import { WebDevBus } from "../../../../runtime/WebDevBus";
import { EVENTS_LOADED } from "../../../../runtime/WebDevBusEvent";
import { DEV_ELEMENT_RENDERED } from "../../decorators/PostElementRenderedDecoratot";
import { DesignElementRegistry } from "../../registry/DesignElementRegistry";
import { AcceptsChild } from "../../types/AcceptsChild";
import { DesignElement } from "../../types/DesignElement";
import { ElementState } from "../../types/ElementState";
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
  private sessionBusSubscription: Subscription | undefined = undefined;
  private webBusSubscription: Subscription | undefined = undefined;
  private devBusSubscription: Subscription | undefined = undefined;
  private initialCreate: WebBusEvent[] = [];
  private initialExceptCreate: WebBusEvent[] = [];
  private constructor() {}
  public static getInstance() {
    if (DesignRuntimeClass.instance === undefined) {
      DesignRuntimeClass.instance = new DesignRuntimeClass();
    }
    return DesignRuntimeClass.instance;
  }
  public addElement(ID: string, state: ElementState) {
    this.state[ID] = state;
  }
  public registerParent(ID: string) {
    this.acceptsChild.push(ID);
  }
  public removeParent(ID: string) {
    this.acceptsChild = this.acceptsChild.filter((childID) => {
      return childID !== ID;
    });
  }
  public getChildAcceptors() {
    return [...this.acceptsChild];
  }
  public getState() {
    return { ...this.state };
  }
  private subscribeWebBusForCreate() {
    console.log("subscribing web bus");
    this.webBusSubscription = WebBus.subscribe({
      next: (v) => {
        if (v && v["type"] === "CREATE") {
          this.initialCreate.push(v);
        } else {
          this.initialExceptCreate.push(v);
        }
      },
    });
  }
  private processInitialEventsExceptCreate() {
    for (let i = 0; i < this.initialExceptCreate.length; i++) {
      const v = this.initialExceptCreate[i];
      if (v && v.type === "PATCH") {
        this.handlePatchEvent(v);
      }
    }
  }
  private unsubscribeWebBus() {
    this.webBusSubscription?.unsubscribe();
  }
  private unsubscribeSessionBus() {
    this.sessionBusSubscription?.unsubscribe();
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
    if (payload.state!.parent === "root") {
      this.canvasRoot.bus.next({ acceptchild: v["payload"].ID });
    } else if (payload.state!.parent) {
      this.state[payload.state!.parent].bus.next({
        acceptchild: payload.ID,
      });
    } else {
      throw new Error("parent should have exist already");
    }
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
          this.getState()[payload.ID].bus.next({
            state: this.getState()[payload.ID]["state"],
          });
          break;
        case "parent":
          const newParent = payload.slice.parent;
          const newParentBus =
            newParent === "root"
              ? this.getCanvasRoot().bus
              : this.getState()[newParent].bus;
          const oldParent = this.getState()[payload.ID].state.parent;
          const oldParentBus =
            oldParent === "root"
              ? this.getCanvasRoot().bus
              : this.getState()[oldParent].bus;
          this.getState()[payload.ID].state.parent = newParent;
          oldParentBus.next({
            removechild: payload.ID,
          });
          newParentBus.next({
            acceptchild: payload.ID,
          });
          break;
      }
    }
  }
  private subscribeSessionBus() {
    // subscribe WebBus
    this.sessionBusSubscription = SessionWebBus.subscribe({
      next: (v) => {
        if (v && v["type"] === "CREATE") {
          this.handleCreateEvent(v);
        }
        if (v && v["type"] === "PATCH") {
          this.handlePatchEvent(v);
        }
      },
    });
  }
  private *getNextInitialCreateEvent() {
    for (let i = 0; i < this.initialCreate.length; i++) {
      yield this.initialCreate[i];
    }
  }
  private subscribeDevBus() {
    const gen = this.getNextInitialCreateEvent();
    this.devBusSubscription = WebDevBus.subscribe({
      next: (v) => {
        if (v) {
          if (v.type === EVENTS_LOADED || v.type === DEV_ELEMENT_RENDERED) {
            const nxt = gen.next();
            if (!nxt.done) {
              this.handleCreateEvent(nxt.value);
            } else {
              // clean up after all elements have been created
              this.unsubscribeWebBus();
              this.unsubscribeDevBus();
              this.processInitialEventsExceptCreate();
              this.subscribeSessionBus();
            }
          }
        }
      },
    });
  }
  private unsubscribeDevBus() {
    if (this.devBusSubscription) this.devBusSubscription.unsubscribe();
  }
  public setCanvasRoot(ref: React.RefObject<HTMLDivElement>) {
    console.log("setting canvas root");
    // only ref changes, others are same as previous
    this.canvasRoot.ref = ref;
    // unsubscribe sessionBus if previously subscribed
    this.unsubscribeSessionBus();
    // subscribe dev bus
    this.subscribeDevBus();
    // if canvas root is set for the second time or more
    // mimic that initial events are already loaded
    if (this.initialCreate.length > 0) {
      WebDevBus.post({
        type: EVENTS_LOADED,
        payload: this.initialCreate.length,
      });
    } else {
      // subscribe web bus to collect all create
      this.subscribeWebBusForCreate();
    }
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
      PostPatchEvent({ ID, slice: patch });
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
      PostPatchEvent({ ID, slice: { style: patch } });
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
      PostPatchEvent({ ID, slice: patch });
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
      PostPatchEvent({ ID, slice: { style: patch } });
    }
  }
}

export const DesignRuntime = createGlobalVariable(
  "DesignRuntime",
  DesignRuntimeClass.getInstance()
);
