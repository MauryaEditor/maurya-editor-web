import { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { DrawRuntimeBus, DrawRuntimeState } from "../rxjs/DrawState";
import { DEV_ELEMENT_RENDERED } from "../utils/ElementDecorator";

declare interface WebCreateData {
  compKey: string;
  pkg: string;
  ID: string;
  state?: { [key: string | number]: any };
}

declare interface WebPatchData {
  ID: string;
  slice: { [key: string | number]: any };
}

declare interface WebLinkData {
  ID: string;
  alias: string;
}

declare interface WebBusEvent {
  type: "CREATE" | "UPDATE" | "PATCH" | "DELETE" | "LINK"; // types of event
  payload: WebCreateData | WebPatchData | WebLinkData; // payload
}

declare function SubscribeWebBus(
  next: (v: WebBusEvent | null) => {}
): Subscription;

declare const PostLinkEvent: (payload: WebLinkData) => string;

export interface WebDevBusEvent {
  type: string;
  payload: any;
}

declare function SubscribeWebDevBus(
  next: (v: WebDevBusEvent) => {}
): Subscription;

declare function SubscribeSessionWebBus(
  next: (v: WebBusEvent | null) => {}
): Subscription;

export type ElementCountRegistry = { [compKey: string]: number };

export type AliasRegistry = { [ID: string]: string };

export const useManageAlias = () => {
  const countRegistryRef = useRef<ElementCountRegistry>({});
  const aliasRegistryRef = useRef<AliasRegistry>({});
  const [sessionElements, setSessionElements] = useState<{
    [ID: string]: true;
  }>({});
  useEffect(() => {
    SubscribeSessionWebBus((v) => {
      if (v && v.type === "CREATE") {
        setSessionElements((curr) => {
          return { ...curr, [v.payload.ID]: true };
        });
      }
      return {};
    });
  }, [setSessionElements]);
  // read registry to create new alias
  // whenever a new element is created
  // use PostLinkEvent on WebBus
  useEffect(() => {
    SubscribeWebDevBus((v) => {
      if (sessionElements[v.payload] && v.type === DEV_ELEMENT_RENDERED) {
        const state = DrawRuntimeState[v.payload];
        countRegistryRef.current[state.compKey] = countRegistryRef.current[
          state.compKey
        ]
          ? countRegistryRef.current[state.compKey]++
          : 1;
        console.log("[useManageAlias] PostLinkEvent called");
        PostLinkEvent({
          ID: v.payload,
          alias: state.compKey + "_" + countRegistryRef.current[state.compKey],
        });
      }
      return {};
    });
  }, [aliasRegistryRef, countRegistryRef, sessionElements]);

  // write to registry on LINK web event
  // post on bus of the element
  useEffect(() => {
    SubscribeWebBus((v) => {
      if (v && v.type === "LINK") {
        console.log("[useManageAlias] Sending change to bus");
        const payload = v.payload as WebLinkData;
        aliasRegistryRef.current[v.payload.ID] = payload.alias;
        DrawRuntimeState[v.payload.ID].bus.next({
          properties: {
            Alias: payload.alias,
          },
        });
      }
      return {};
    });
  }, [aliasRegistryRef]);
};
