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
import { ElementState } from "../../types/ElementState";

export class DesignRuntime {
  private static instance: DesignRuntime = new DesignRuntime();
  private static state: { [ID: string]: ElementState };
  private static acceptsChild: string[] = [];
  private constructor() {}
  public static getInstance() {
    if (DesignRuntime.instance === undefined) {
      DesignRuntime.instance = new DesignRuntime();
    }
    return DesignRuntime.instance;
  }
  public static addElement(ID: string, state: ElementState) {
    DesignRuntime.state[ID] = state;
  }
  public static registerParent(ID: string) {
    DesignRuntime.acceptsChild.push(ID);
  }
  public static removeParent(ID: string) {
    DesignRuntime.acceptsChild = DesignRuntime.acceptsChild.filter(
      (childID) => {
        return childID !== ID;
      }
    );
  }
}

DesignRuntime.getInstance();
