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
import { BehaviorSubject, ReplaySubject, Subscription } from "rxjs";
import { ComponentItem } from "./ComponentRegistry";
import { SliceableReplaySubject } from "./SliceableReplaySubject";

export const DesignComponentSelected =
  new BehaviorSubject<ComponentItem | null>(null);

export type PropertyMap = { [key: string]: { value: any; type: string } };

// store ID: Bus
export type DrawRuntimeValue = { [key: string | number]: any } & {
  bus: SliceableReplaySubject<any>;
  style: React.CSSProperties;
  properties: PropertyMap;
  renderProps: { [key: string | number]: any };
  propertyOrder: string[];
  appearance: PropertyMap;
  appearanceOrder: string[];
  compKey: string;
  ref?: React.RefObject<HTMLElement>;
};

export const DrawRuntimeState: {
  [ID: string]: DrawRuntimeValue;
} = {};

export const DrawRuntimeBus = new BehaviorSubject<{
  ID: string;
  payload: {
    bus?: SliceableReplaySubject<any>;
    style?: React.CSSProperties;
    properties?: PropertyMap;
    renderProps?: { [key: string | number]: any };
    propertyOrder?: string[];
    appearance?: PropertyMap;
    appearanceOrder?: string[];
    compKey?: string;
    ref?: React.RefObject<HTMLElement>;
  };
} | null>(null);

DrawRuntimeBus.subscribe({
  next: (v) => {
    if (v)
      DrawRuntimeState[v.ID] = {
        ...DrawRuntimeState[v.ID],
        ...v.payload,
      };
  },
});

export type PropertyType = "Properties" | "Appearance";

export type DisplayPropertyValue = {
  ID: string;
  Properties: { propertyName: string; value: string; type: string }[];
  Appearance: { propertyName: string; value: string; type: string }[];
  activeHeader: PropertyType;
};

const DisplayProperty = new BehaviorSubject<DisplayPropertyValue | null>(null);

function propertyFromPropertyMap(
  propertyMap: PropertyMap,
  propertyOrder: string[]
) {
  const properties: { propertyName: string; value: string; type: string }[] =
    [];
  for (let i = 0; i < propertyOrder.length; i++) {
    if (propertyMap[propertyOrder[i]]) {
      properties.push({
        propertyName: propertyOrder[i],
        value: propertyMap[propertyOrder[i]].value,
        type: propertyMap[propertyOrder[i]].type,
      });
    }
  }
  return properties;
}

function displayPropertyFromState(
  ID: string
): Omit<DisplayPropertyValue, "activeHeader"> {
  const state = DrawRuntimeState[ID];
  return {
    ID,
    Properties: propertyFromPropertyMap(state.properties, state.propertyOrder),
    Appearance: propertyFromPropertyMap(
      state.appearance,
      state.appearanceOrder
    ),
  };
}

export function InitDrawRuntimeState(
  init: Partial<DrawRuntimeValue>
): DrawRuntimeValue {
  const value: DrawRuntimeValue = {
    bus: init.bus || new SliceableReplaySubject<any>(),
    style: init.style || {},
    properties: init.properties || {},
    propertyOrder: init.propertyOrder || [],
    appearance: init.appearance || {},
    appearanceOrder: init.appearanceOrder || [],
    renderProps: init.renderProps || {},
    compKey: init.compKey || "",
  };
  return value;
}

export const SubscribeDisplayProperty = (subscriber: {
  next: (value: DisplayPropertyValue | null) => void;
}): Subscription => {
  return DisplayProperty.subscribe(subscriber);
};

// map of element ids and subscription to their bus
let currentDisplayPropertyElements: { [ID: string]: Subscription } = {};

/**
 * This function must be called to
 * @param ID string
 */
export function PostDisplayPropertyByID(
  ID: string,
  activeHeader: PropertyType
) {
  // // unsubscribe existing subscriptions
  // const currentSubscriptions = Object.values(currentDisplayPropertyElements);
  // for (let i = 0; i < currentSubscriptions.length; i++) {
  //   if (currentSubscriptions[i] && !currentSubscriptions[i].closed)
  //     currentSubscriptions[i].unsubscribe();
  // }

  // // reset map to empty
  // currentDisplayPropertyElements = {};

  // // subscribe to element bus
  // const bus = DrawRuntimeState[ID].bus;
  // const newSubscription = bus.subscribe(() => {
  //   // DisplayProperty.next({ ...displayPropertyFromState(ID), activeHeader });
  // });

  // // add subscription to map
  // currentDisplayPropertyElements = { ID: newSubscription };

  DisplayProperty.next({ ...displayPropertyFromState(ID), activeHeader });
}

// Get Display Property Value
export function GetDisplayPropertyValue() {
  return DisplayProperty.value;
}

export const DragOverElement = new BehaviorSubject<string[]>([]);
