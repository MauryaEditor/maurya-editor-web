import { BusPostOptions } from "./Bus";
import { Runtime } from "./Runtime";
import { SessionWebBus } from "./SessionWebBus";
import { WebBus } from "./WebBus";
import {
  WebBusEvent,
  WebCreateData,
  WebLinkData,
  WebPatchData,
} from "./WebBusEvent";
import { WebDevBus } from "./WebDevBus";
import { WebDevBusEvent } from "./WebDevBusEvent";

export const PostCreateEvent = (
  payload: Omit<WebCreateData, "tempID">,
  busOptions?: BusPostOptions
): string => {
  const ID = Runtime.getID();
  const webEvent: WebBusEvent = {
    payload: { ...payload, ID },
    type: "CREATE",
  };
  Runtime.addEvent({ ...webEvent });
  SessionWebBus.next(webEvent);
  WebBus.post({ ...webEvent }, busOptions);
  return ID;
};

(window as any).PostCreateEvent = PostCreateEvent;

export const PostPatchEvent = (
  payload: WebPatchData,
  busOptions?: BusPostOptions
): string => {
  const webEvent: WebBusEvent = {
    payload: { ...payload },
    type: "PATCH",
  };
  Runtime.addEvent({ ...webEvent });
  SessionWebBus.next(webEvent);
  WebBus.post({ ...webEvent }, busOptions);
  return payload.ID;
};

(window as any).PostPatchEvent = PostPatchEvent;

export const PostLinkEvent = (
  payload: WebLinkData,
  busOptions?: BusPostOptions
): string => {
  const webEvent: WebBusEvent = {
    payload: { ...payload },
    type: "LINK",
  };
  Runtime.addEvent({ ...webEvent });
  SessionWebBus.next(webEvent);
  WebBus.post({ ...webEvent }, busOptions);
  return payload.ID;
};

(window as any).PostLinkEvent = PostLinkEvent;

export function PostWebDevBusEvent(event: WebDevBusEvent) {
  WebDevBus.next(event);
}

(window as any).PostWebDevBusEvent = PostWebDevBusEvent;
