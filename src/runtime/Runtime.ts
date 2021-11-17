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
import {
  SessionWebBus,
  WebBus,
  WebBusEvent,
  WebCreateData,
  WebLinkData,
  WebPatchData,
} from "../rxjs/EditorConfig";

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

const fetchIDs = async (size: number) => {
  const uri = `${process.env.REACT_APP_BACKEND_ORIGIN}/uuid?size=${size}`;
  const uris = await fetch(uri).then((resp) => resp.json());
  return uris;
};

const storeIDsAt = (index: number, payload: string[], token: string) => {
  RuntimeState.IDBank[index] = { payload, token };
};

const AccountSize = 20;

// retrieve events from backend
async function retrieveEvents(): Promise<WebBusEvent[] | undefined> {
  const { token } = getAuth();
  const projectID = getProjectID();
  // TODO: handle what if non-logged in user tries to access this page
  if (!token || !projectID) {
    return;
  }
  return await fetch(
    `${process.env.REACT_APP_BACKEND_ORIGIN}/web-events?pid=${projectID}&token=${token}`
  ).then((resp) => resp.json());
}

/**
 * It does two things:
 * 1. Retrieve old events if the project is old
 * 2. fetch new IDs
 */
const InitRuntime = async () => {
  // TODO: convert all the tasks into a single Promise.all

  const events = await retrieveEvents();
  if (events) {
    events.forEach((event) => {
      WebBus.next(event);
    });
  }
  let { payload, token }: IDPoolResponse = await fetchIDs(AccountSize);
  storeIDsAt(0, payload.pool, token);
};

InitRuntime()
  .then(() => {
    console.log("Runtime Init success", RuntimeState);
  })
  .catch((err) => {
    console.error("Runtime Init failed", err);
  });

const getID = (): string => {
  const ID =
    RuntimeState.IDBank[Math.floor(RuntimeState.currIndex / AccountSize)]
      ?.payload[RuntimeState.currIndex % AccountSize];
  RuntimeState.currIndex++;
  // reload the pool if it's depleted
  // TODO: fetch early i.e. dont let the pool deplete
  if (RuntimeState.currIndex % AccountSize === 0) {
    fetchIDs(AccountSize).then((val: IDPoolResponse) => {
      storeIDsAt(
        Math.floor(RuntimeState.currIndex / AccountSize),
        val.payload.pool,
        val.token
      );
    });
  }
  if (ID) {
    (RuntimeState.IDIssued as any)[ID] = true;
    return ID;
  } else {
    throw new Error("ID Bank is bankrupt");
  }
};

export const PostCreateEvent = (
  payload: Omit<WebCreateData, "tempID">
): string => {
  const ID = getID();
  const webEvent: WebBusEvent = {
    payload: { ...payload, ID },
    type: "CREATE",
  };
  RuntimeState.tempEvents.push({ ...webEvent });
  SessionWebBus.next(webEvent);
  WebBus.next({ ...webEvent });
  return ID;
};

(window as any).PostCreateEvent = PostCreateEvent;

export const PostPatchEvent = (payload: WebPatchData): string => {
  const webEvent: WebBusEvent = {
    payload: { ...payload },
    type: "PATCH",
  };
  RuntimeState.tempEvents.push({ ...webEvent });
  SessionWebBus.next(webEvent);
  WebBus.next({ ...webEvent });
  return payload.ID;
};

(window as any).PostPatchEvent = PostPatchEvent;

export const PostLinkEvent = (payload: WebLinkData): string => {
  const webEvent: WebBusEvent = {
    payload: { ...payload },
    type: "LINK",
  };
  RuntimeState.tempEvents.push({ ...webEvent });
  SessionWebBus.next(webEvent);
  WebBus.next({ ...webEvent });
  return payload.ID;
};

(window as any).PostPatchEvent = PostPatchEvent;

// send event
const sendEvent = (event: WebBusEvent) => {
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
  return fetch(
    `${process.env.REACT_APP_BACKEND_ORIGIN}/web-events`,
    options
  ).then((resp) => resp.json());
};

// send events to backend
function syncEngine() {
  setTimeout(async () => {
    for (
      let i = RuntimeState.currSyncIndex;
      i < RuntimeState.tempEvents.length;
      i++
    ) {
      await sendEvent(RuntimeState.tempEvents[RuntimeState.currSyncIndex]);
      RuntimeState.currSyncIndex++;
    }
    syncEngine();
  }, 5000);
}

syncEngine();
