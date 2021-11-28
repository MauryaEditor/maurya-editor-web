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
import { WebBus } from "../../../../runtime/WebBus";
import { WebCreateData } from "../../../../runtime/WebBusEvent";
import { ElementState } from "../../types/ElementState";
import { ElementStateFactory } from "../ElementStateFactory/ElementStateFactory";

export class DesignRuntime {
  private static instance: DesignRuntime = new DesignRuntime();
  private static canvasRoot: {
    ref: React.RefObject<HTMLDivElement>;
    bus: Subject<{ acceptchild?: string }>;
  } = {
    ref: React.createRef(),
    bus: new Subject<{ acceptchild?: string }>(),
  };
  private static state: { [ID: string]: ElementState } = {};
  private static acceptsChild: string[] = [];
  private static webBusSubscription: Subscription;
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
        }
      },
    });
  }
  public static setCanvasRoot(ref: React.RefObject<HTMLDivElement>) {
    // only ref changes, others are same as previous
    DesignRuntime.canvasRoot.ref = ref;
    // remove previous subscription to WebBus
    DesignRuntime.unsubscribeWebBus();
    // subscribe web bus for the first time or again
    DesignRuntime.subscribeWebBus();
  }
  public static getCanvasRoot() {
    return { ...DesignRuntime.canvasRoot };
  }
}

DesignRuntime.getInstance();
