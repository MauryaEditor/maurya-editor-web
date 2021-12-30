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

import { IDPoolResponse } from "../dto/IDPoolResponse";
import { getAuth } from "../lib/getAuth";
import { getProjectID } from "../lib/getProjectID";
import { WebBus } from "./WebBus";
import "./SessionWebBus";
import "./WebDevBus";
import "./commands";
import {
  WebBusEvent,
  WebCreateData,
  WebLinkData,
  WebPatchData,
} from "./WebBusEvent";
import { WebDevBus } from "./WebDevBus";
import { EVENTS_LOADED, WebDevBusEvent } from "./WebDevBusEvent";
import { backendUrl } from "../lib/backend-url";
import { createGlobalVariable } from "../lib/createGlobalVariable";
import { BusPostOptions } from "./Bus";
import { SessionWebBus } from "./SessionWebBus";
import { Observer, Subscription } from "rxjs";
import { PostCreateEvent } from "./commands";

export const RuntimeState: {
  IDIssued: any;
  tempEvents: WebBusEvent[]; // stores the events in this user session
  currIndex: number;
  IDBank: { payload: string[]; token: string }[];
  currSyncIndex: number;
} = {
  IDIssued: {},
  tempEvents: [],
  currIndex: 0,
  IDBank: [],
  currSyncIndex: 0,
};

const AccountSize = 20;

export class RuntimeClass {
  static instance: RuntimeClass;
  private IDIssued: any = {};
  private tempEvents: WebBusEvent[] = [];
  private currIndex: number = 0;
  private IDBank: { payload: string[]; token: string }[] = [];
  private currSyncIndex: number = 0;
  private constructor() {
    this.retrieveEvents().then((events) => {
      if (events) {
        events.forEach((event) => {
          WebBus.post(event);
        });
        WebDevBus.post({ type: EVENTS_LOADED, payload: events.length });
      } else {
        // TODO: temporary fix
        // send EVENTS_LOADED when there is no projectID
        setTimeout(() => {
          WebDevBus.post({ type: EVENTS_LOADED, payload: 0 });
        }, 2000);
      }
    });
    this.fetchIDs(AccountSize).then(({ payload, token }: IDPoolResponse) => {
      this.storeIDsAt(0, payload.pool, token);
    });
    this.syncEvents();
  }
  public static getRuntime() {
    if (!RuntimeClass.instance) RuntimeClass.instance = new RuntimeClass();
    return this.instance;
  }
  private async retrieveEvents(): Promise<WebBusEvent[] | undefined> {
    const { token } = getAuth();
    const projectID = getProjectID();
    // TODO: handle what if non-logged in user tries to access this page
    if (!token || !projectID) {
      return;
    }
    return await fetch(
      `${backendUrl}/web-events?pid=${projectID}&token=${token}`
    ).then((resp) => resp.json());
  }
  private async fetchIDs(size: number) {
    const uri = `${backendUrl}/uuid?size=${size}`;
    const uris = await fetch(uri).then((resp) => resp.json());
    return uris;
  }
  private storeIDsAt(index: number, payload: string[], token: string) {
    this.IDBank[index] = { payload, token };
  }
  public getID() {
    const ID =
      this.IDBank[Math.floor(this.currIndex / AccountSize)]?.payload[
        this.currIndex % AccountSize
      ];
    this.currIndex++;
    // reload the pool if it's depleted
    // TODO: fetch early i.e. dont let the pool deplete
    if (this.currIndex % AccountSize === 0) {
      this.fetchIDs(AccountSize).then((val: IDPoolResponse) => {
        this.storeIDsAt(
          Math.floor(this.currIndex / AccountSize),
          val.payload.pool,
          val.token
        );
      });
    }
    if (ID) {
      (this.IDIssued as any)[ID] = true;
      return ID;
    } else {
      throw new Error("ID Bank is bankrupt");
    }
  }
  private sendEvent(event: WebBusEvent) {
    const { token } = getAuth();
    const projectID = getProjectID();
    if (!token || !projectID) {
      return;
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ ...event, token, projectID }),
    };
    return fetch(`${backendUrl}/web-events`, options).then((resp) =>
      resp.json()
    );
  }
  private syncEvents() {
    setTimeout(async () => {
      for (let i = this.currSyncIndex; i < this.tempEvents.length; i++) {
        await this.sendEvent(this.tempEvents[this.currSyncIndex]);
        this.currSyncIndex++;
      }
      this.syncEvents();
    }, 5000);
  }
  public addEvent(event: WebBusEvent) {
    this.tempEvents.push(event);
  }

  //Commands

  postCreateEvent = (
    payload: Omit<WebCreateData, "ID">,
    busOptions?: BusPostOptions
  ): string => {
    return PostCreateEvent(payload, busOptions);
  };
  postPatchEvent = (
    payload: WebPatchData,
    busOptions?: BusPostOptions
  ): string => {
    const webEvent: WebBusEvent = {
      payload: { ...payload },
      type: "PATCH",
    };
    Runtime.addEvent({ ...webEvent });
    SessionWebBus.post({ ...webEvent }, busOptions);
    WebBus.post({ ...webEvent }, busOptions);
    return payload.ID;
  };
  postLinkEvent = (
    payload: WebLinkData,
    busOptions?: BusPostOptions
  ): string => {
    const webEvent: WebBusEvent = {
      payload: { ...payload },
      type: "LINK",
    };
    Runtime.addEvent({ ...webEvent });
    SessionWebBus.post({ ...webEvent }, busOptions);
    WebBus.post({ ...webEvent }, busOptions);
    return payload.ID;
  };

  postWebDevBusEvent(event: WebDevBusEvent) {
    WebDevBus.post(event);
  }

  subscribeWebDevBus = (
    observer: Partial<Observer<WebDevBusEvent>>
  ): Subscription => {
    return WebDevBus.subscribe(observer);
  };

  subscribeWebBus = (
    observer: Partial<Observer<WebBusEvent>>
  ): Subscription => {
    return WebBus.subscribe(observer);
  };

  subscribeSessionWebBus = (
    observer: Partial<Observer<WebBusEvent>>
  ): Subscription => {
    return SessionWebBus.subscribe(observer);
  };
}
export const Runtime = RuntimeClass.getRuntime();
createGlobalVariable("Runtime", Runtime);
