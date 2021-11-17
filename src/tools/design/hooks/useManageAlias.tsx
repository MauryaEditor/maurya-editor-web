import { useEffect, useRef } from "react";
import { Subscription } from "rxjs";
import { DrawRuntimeState } from "../rxjs/DrawState";

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

declare function SubscribeSessionWebBus(
  next: (v: WebBusEvent | null) => {}
): Subscription;

declare function SubscribeWebBus(
  next: (v: WebBusEvent | null) => {}
): Subscription;

declare const PostLinkEvent: (payload: WebLinkData) => string;

export type ElementCountRegistry = { [compKey: string]: number };

export type AliasRegistry = { [ID: string]: string };

export const useManageAlias = () => {
  const countRegistryRef = useRef<ElementCountRegistry>({});
  const aliasRegistryRef = useRef<AliasRegistry>({});

  // read registry to create new alias
  // whenever a new element is created
  // use PostLinkEvent on WebBus
  useEffect(() => {
    SubscribeSessionWebBus((v) => {
      if (v && v.type === "CREATE") {
        const payload = v.payload as WebCreateData;
        countRegistryRef.current[payload.compKey] = countRegistryRef.current[
          payload.compKey
        ]
          ? countRegistryRef.current[payload.compKey]++
          : 1;
        PostLinkEvent({
          ID: payload.ID,
          alias:
            payload.compKey + "_" + countRegistryRef.current[payload.compKey],
        });
      }
      return {};
    });
  }, [aliasRegistryRef, countRegistryRef]);

  // write to registry on LINK web event
  // post on bus of the element
  useEffect(() => {
    SubscribeWebBus((v) => {
      if (v && v.type === "LINK") {
        aliasRegistryRef.current[v.payload.ID] = (
          v.payload as WebLinkData
        ).alias;
        DrawRuntimeState[v.payload.ID].bus.next({
          properties: { alias: (v.payload as WebLinkData).alias },
        });
      }
      return {};
    });
  }, [aliasRegistryRef]);
};
