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
import { WebBusEvent } from "./WebBusEvent";
import { WebDevBus } from "./WebDevBus";
import { EVENTS_LOADED } from "./WebDevBusEvent";
import { backendUrl } from "../lib/backend-url";

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

export class Runtime {
  static instance: Runtime;
  private static IDIssued: any = {};
  private static tempEvents: WebBusEvent[] = [];
  private static currIndex: number = 0;
  private static IDBank: { payload: string[]; token: string }[] = [];
  private static currSyncIndex: number = 0;
  private constructor() {
    Runtime.retrieveEvents().then((events) => {
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
    Runtime.fetchIDs(AccountSize).then(({ payload, token }: IDPoolResponse) => {
      Runtime.storeIDsAt(0, payload.pool, token);
    });
    Runtime.syncEvents();
  }
  public static getRuntime() {
    if (!Runtime.instance) Runtime.instance = new Runtime();
    return Runtime.instance;
  }
  private static async retrieveEvents(): Promise<WebBusEvent[] | undefined> {
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
  private static async fetchIDs(size: number) {
    const uri = `${backendUrl}/uuid?size=${size}`;
    const uris = await fetch(uri).then((resp) => resp.json());
    return uris;
  }
  private static storeIDsAt(index: number, payload: string[], token: string) {
    Runtime.IDBank[index] = { payload, token };
  }
  public static getID() {
    const ID =
      Runtime.IDBank[Math.floor(Runtime.currIndex / AccountSize)]?.payload[
        Runtime.currIndex % AccountSize
      ];
    Runtime.currIndex++;
    // reload the pool if it's depleted
    // TODO: fetch early i.e. dont let the pool deplete
    if (Runtime.currIndex % AccountSize === 0) {
      Runtime.fetchIDs(AccountSize).then((val: IDPoolResponse) => {
        Runtime.storeIDsAt(
          Math.floor(Runtime.currIndex / AccountSize),
          val.payload.pool,
          val.token
        );
      });
    }
    if (ID) {
      (Runtime.IDIssued as any)[ID] = true;
      return ID;
    } else {
      throw new Error("ID Bank is bankrupt");
    }
  }
  private static sendEvent(event: WebBusEvent) {
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
  private static syncEvents() {
    setTimeout(async () => {
      for (let i = Runtime.currSyncIndex; i < Runtime.tempEvents.length; i++) {
        await Runtime.sendEvent(Runtime.tempEvents[Runtime.currSyncIndex]);
        Runtime.currSyncIndex++;
      }
      Runtime.syncEvents();
    }, 5000);
  }
  public static addEvent(event: WebBusEvent) {
    this.tempEvents.push(event);
  }
}
const runtime = Runtime.getRuntime();
