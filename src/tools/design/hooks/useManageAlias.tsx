import { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { DrawRuntimeState } from "../rxjs/DrawState";
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

export type ElementCountRegistry = { [compKey: string]: number };

export type AliasRegistry = { [ID: string]: string };

export const useManageAlias = () => {
  const countRegistryRef = useRef<ElementCountRegistry>({});
  const aliasRegistryRef = useRef<AliasRegistry>({});

  // read registry to create new alias
  // whenever a new element is created
  // use PostLinkEvent on WebBus
  useEffect(() => {
    SubscribeWebDevBus((v) => {
      if (v.type === DEV_ELEMENT_RENDERED) {
        const state = DrawRuntimeState[v.payload];
        countRegistryRef.current[state.compKey] = countRegistryRef.current[
          state.compKey
        ]
          ? countRegistryRef.current[state.compKey]++
          : 1;
        PostLinkEvent({
          ID: v.payload,
          alias: state.compKey + "_" + countRegistryRef.current[state.compKey],
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
