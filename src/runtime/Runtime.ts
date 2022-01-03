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
import { WebDevBusEvent } from "./WebDevBusEvent";
import { backendUrl } from "../lib/backend-url";
import { createGlobalVariable } from "../lib/createGlobalVariable";
import { BusPostOptions } from "./Bus";
import { SessionWebBus } from "./SessionWebBus";
import { Observer, Subscription } from "rxjs";
import { PostCreateEvent, PostLinkEvent, PostPatchEvent } from "./commands";

export const RuntimeState: {
  IDIssued: any;
  sessionEvents: WebBusEvent[]; // stores the events in this user session
  currIndex: number;
  IDBank: { payload: string[]; token: string }[];
  currSyncIndex: number;
} = {
  IDIssued: {},
  sessionEvents: [],
  currIndex: 0,
  IDBank: [],
  currSyncIndex: 0,
};

const AccountSize = 20;

export class RuntimeClass {
  // the single instance of RuntimeClass
  static instance: RuntimeClass;
  // store the id's issued. just to double check if the id assigned to an
  // element is from the pool of id received
  private IDIssued: any = {};
  // stores event from this session only
  private sessionEvents: WebBusEvent[] = [];
  // stores fresh/unused IDs that can be assigned to elements
  private IDBank: { payload: string[]; token: string }[] = [];
  // stores the index at which the next entry will be added in the IDBank
  private currIndex: number = 0;
  // stores the index of next event from this.sessionEvents to be sent to the backend
  private currSyncIndex: number = 0;
  // an array to store all the callbacks once Runtime is ready
  private onReadySubscribers: (() => void)[] = [];
  // a flag to indicate whether the Runtime is ready
  // Runtime is ready once all the events have been loaded on WebBus
  private isReady: boolean = false;
  private constructor() {
    this.initialSync().then(() => {
      this.callOnReadySubscribers();
      this.isReady = true;
    });
    this.syncEvents();
  }
  // fetch latest save of the project
  private initialSync(): Promise<void> {
    return new Promise<void>((res, rej) => {
      const requests = Promise.all([
        this.retrieveEvents(),
        this.fetchIDs(AccountSize),
      ]);
      requests.then((values) => {
        const events = values[0];
        if (events) {
          events.forEach((event) => {
            WebBus.post(event);
          });
        }
        const { payload, token } = values[1] as IDPoolResponse;
        this.storeIDsAt(0, payload.pool, token);
        res();
      });
    });
  }
  private callOnReadySubscribers() {
    if (!this.isReady) {
      // an extra guide to prevent from being called more than once
      this.onReadySubscribers.forEach((f) => {
        f();
      });
    }
  }
  // register/call cb once Runtime is ready
  onReady(cb: () => void) {
    // call immediately if the Runtime is already ready
    // else push in onReadySubscibers
    if (this.isReady) {
      cb();
    } else {
      this.onReadySubscribers.push(cb);
    }
  }
  public static getRuntime() {
    if (!RuntimeClass.instance) RuntimeClass.instance = new RuntimeClass();
    return this.instance;
  }
  // retrieve old events from the backend
  private async retrieveEvents(): Promise<WebBusEvent[] | undefined> {
    const { token } = getAuth();
    const projectID = getProjectID();
    // TODO: handle what if non-logged in user tries to access this page
    if (!token || !projectID) {
      return;
    }
    // TODO: check if the request to retrieve events was successful
    return await fetch(
      `${backendUrl}/web-events?pid=${projectID}&token=${token}`
    ).then((resp) => resp.json());
  }
  // fetch new IDs from the backend
  // these IDs will be assigned to dragged elements etc.
  private async fetchIDs(size: number) {
    const uri = `${backendUrl}/uuid?size=${size}`;
    const uris = await fetch(uri).then((resp) => resp.json());
    return uris;
  }
  // helper function to store the IDs from this.fetchIDs at correct index
  private storeIDsAt(index: number, payload: string[], token: string) {
    this.IDBank[index] = { payload, token };
  }
  // returns a fresh ID from this.IDBank
  // also handles if new IDs should be fetched
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
  // helper function to send event to the backend
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
  // syncs events with the backend
  private syncEvents() {
    setTimeout(async () => {
      for (let i = this.currSyncIndex; i < this.sessionEvents.length; i++) {
        await this.sendEvent(this.sessionEvents[this.currSyncIndex]);
        this.currSyncIndex++;
      }
      this.syncEvents();
    }, 5000);
  }
  public addEvent(event: WebBusEvent) {
    this.sessionEvents.push(event);
  }
  postCreateEvent(
    payload: Omit<WebCreateData, "ID">,
    busOptions?: BusPostOptions
  ): string {
    return PostCreateEvent(payload, busOptions);
  }
  postPatchEvent(payload: WebPatchData, busOptions?: BusPostOptions): string {
    return PostPatchEvent(payload, busOptions);
  }
  postLinkEvent(payload: WebLinkData, busOptions?: BusPostOptions): string {
    return PostLinkEvent(payload, busOptions);
  }
  postWebDevBusEvent(event: WebDevBusEvent) {
    WebDevBus.post(event);
  }
  subscribeWebDevBus(
    observer: Partial<Observer<WebDevBusEvent>>
  ): Subscription {
    return WebDevBus.subscribe(observer);
  }
  subscribeWebBus(observer: Partial<Observer<WebBusEvent>>): Subscription {
    return WebBus.subscribe(observer);
  }
  getWebBusEventGenerator() {
    return WebBus.getEventsGenerator();
  }
  subscribeSessionWebBus(
    observer: Partial<Observer<WebBusEvent>>
  ): Subscription {
    return SessionWebBus.subscribe(observer);
  }
}

export const Runtime = RuntimeClass.getRuntime();
createGlobalVariable("Runtime", Runtime);
