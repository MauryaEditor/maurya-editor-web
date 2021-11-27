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
import { BehaviorSubject } from "rxjs";
import { RenderProps } from "./RenderProps";
export interface ElementState {
  // synced with database
  compKey: string;
  state: {
    style: React.CSSProperties; // dev related styles only like position, top, left
    properties: { [key: string | number]: any };
    appearance: { [key: string | number]: any };
    parent: string;
  };
  // fields need only in front end
  bus: BehaviorSubject<Partial<Omit<ElementState, "bus">>>;
  propertyMap: { key: string }[];
  appearanceMap: { key: string }[];
  renderProps: RenderProps;
  ref: React.RefObject<HTMLElement>;
}
