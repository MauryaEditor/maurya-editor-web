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
import { Subject, Subscription } from "rxjs";
import { PostLinkEvent, PostPatchEvent } from "../../../../runtime/commands";
import { WebBus } from "../../../../runtime/WebBus";
import { WebCreateData, WebPatchData } from "../../../../runtime/WebBusEvent";
import { WebDevBus } from "../../../../runtime/WebDevBus";
import { AcceptsChild } from "../../types/AcceptsChild";
import { ElementState } from "../../types/ElementState";
import { ElementStateFactory } from "../ElementStateFactory/ElementStateFactory";

export class DesignRuntime {
  private static instance: DesignRuntime = new DesignRuntime();
  private static canvasRoot: {
    ref: React.RefObject<HTMLDivElement>;
    bus: Subject<AcceptsChild>;
  } = {
    ref: React.createRef(),
    bus: new Subject<AcceptsChild>(),
  };
  private static state: { [ID: string]: ElementState } = {};
  private static acceptsChild: string[] = [];
  private static webBusSubscription: Subscription;
  private static devBusSubscription: Subscription;
  private constructor() {}
  public static getInstance() {
    if (DesignRuntime.instance === undefined) {
      DesignRuntime.instance = new DesignRuntime();
    }
    return DesignRuntime.instance;
  }
  public static addElement(ID: string, state: ElementState) {
    DesignRuntime.state[ID] = state;
  }
  public static registerParent(ID: string) {
    DesignRuntime.acceptsChild.push(ID);
  }
  public static removeParent(ID: string) {
    DesignRuntime.acceptsChild = DesignRuntime.acceptsChild.filter(
      (childID) => {
        return childID !== ID;
      }
    );
  }
  public static getChildAcceptors() {
    return [...DesignRuntime.acceptsChild];
  }
  public static getState() {
    return { ...DesignRuntime.state };
  }
  private static unsubscribeWebBus() {
    DesignRuntime.webBusSubscription?.unsubscribe();
  }
  private static subscribeWebBus() {
    // subscribe WebBus
    DesignRuntime.webBusSubscription = WebBus.subscribe({
      next: (v) => {
        if (v && v["type"] === "CREATE") {
          // update runtime state
          const payload = v.payload as WebCreateData;
          // TODO: ensure that payload.state!.parent exists
          DesignRuntime.state[payload.ID] = ElementStateFactory.create(
            payload.compKey,
            payload.ID,
            payload.state!.parent
          );
          DesignRuntime.state[payload.ID].state = {
            style: payload.state?.style || {},
            properties: payload.state?.properties || {},
            appearance: payload.state?.appearance || {},
            parent: payload.state?.parent,
          };
          // send to parent
          if (payload.state!.parent === "root") {
            DesignRuntime.canvasRoot.bus.next({ acceptchild: v["payload"].ID });
          } else if (payload.state!.parent) {
            DesignRuntime.state[payload.state!.parent].bus.next({
              acceptchild: payload.ID,
            });
          } else {
            throw new Error("parent should have exist already");
          }
        }
        if (v && v["type"] === "PATCH") {
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
                if (DesignRuntime.getState()[payload.ID]["state"][key]) {
                  DesignRuntime.getState()[payload.ID]["state"][key] = {
                    ...DesignRuntime.getState()[payload.ID]["state"][key],
                    ...payload.slice[key],
                  };
                } else {
                  DesignRuntime.getState()[payload.ID]["state"][key] = {
                    ...payload.slice[key],
                  };
                }
                DesignRuntime.getState()[payload.ID].bus.next({
                  state: DesignRuntime.getState()[payload.ID]["state"],
                });
                break;
              case "parent":
                console.log("updating parent");
                const newParent = payload.slice.parent;
                const newParentBus =
                  newParent === "root"
                    ? DesignRuntime.getCanvasRoot().bus
                    : DesignRuntime.getState()[newParent].bus;
                const oldParent =
                  DesignRuntime.getState()[payload.ID].state.parent;
                const oldParentBus =
                  oldParent === "root"
                    ? DesignRuntime.getCanvasRoot().bus
                    : DesignRuntime.getState()[oldParent].bus;
                DesignRuntime.getState()[payload.ID].state.parent = newParent;
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
      },
    });
  }
  private static subscribeDevBus() {
    DesignRuntime.devBusSubscription = WebDevBus.subscribe({
      next: (v) => {
        if (v) {
          console.log("rendered", v);
        }
      },
    });
  }
  private static unsubscribeDevBus() {
    if (DesignRuntime.devBusSubscription)
      DesignRuntime.devBusSubscription.unsubscribe();
  }
  public static setCanvasRoot(ref: React.RefObject<HTMLDivElement>) {
    // only ref changes, others are same as previous
    DesignRuntime.canvasRoot.ref = ref;
    // remove previous subscription to WebBus
    DesignRuntime.unsubscribeWebBus();
    // subscribe web bus for the first time or again
    DesignRuntime.subscribeWebBus();
    // unsubscribe web dev bus
    DesignRuntime.unsubscribeDevBus();
    // subscribe dev bus
    DesignRuntime.subscribeDevBus();
  }
  public static getCanvasRoot() {
    return { ...DesignRuntime.canvasRoot };
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
  public static linkAlias(ID: string, alias: string, record: boolean = false) {
    DesignRuntime.getState()[ID].alias = alias;
    if (record) {
      PostLinkEvent({ ID, alias });
    }
  }
}

DesignRuntime.getInstance();
