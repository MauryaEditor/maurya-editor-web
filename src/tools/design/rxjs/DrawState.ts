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
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { ComponentItem } from "./ComponentRegistry";

export const DesignComponentSelected =
  new BehaviorSubject<ComponentItem | null>(null);

export type PropertyMap = { [key: string]: { value: any; type: string } };

// store ID: Bus
export type DrawRuntimeValue = { [key: string | number]: any } & {
  bus: ReplaySubject<any>;
  style: React.CSSProperties;
  properties: PropertyMap;
  renderProps: { [key: string | number]: any };
  propertyOrder: string[];
  appearance: PropertyMap;
  appearanceOrder: string[];
};

export const DrawRuntimeState: {
  [ID: string]: DrawRuntimeValue;
} = {};

export const DrawRuntimeBus = new BehaviorSubject<{
  ID: string;
  payload: {
    bus?: ReplaySubject<any>;
    style?: React.CSSProperties;
    properties?: PropertyMap;
    renderProps?: { [key: string | number]: any };
    propertyOrder?: string[];
    appearance?: PropertyMap;
    appearanceOrder?: string[];
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
export const DisplayProperty = new BehaviorSubject<{
  ID: string;
  Properties: { propertyName: string; value: string; type: string }[];
  Appearance: { propertyName: string; value: string; type: string }[];
  activeHeader: PropertyType;
} | null>(null);

export function propertyFromPropertyMap(
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

export function InitDrawRuntimeState(
  init: Partial<DrawRuntimeValue>
): DrawRuntimeValue {
  const value: DrawRuntimeValue = {
    bus: init.bus || new ReplaySubject<any>(),
    style: init.style || {},
    properties: init.properties || {},
    propertyOrder: init.propertyOrder || [],
    appearance: init.appearance || {},
    appearanceOrder: init.appearanceOrder || [],
    renderProps: init.renderProps || {},
  };
  return value;
}
