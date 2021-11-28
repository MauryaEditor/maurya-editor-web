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

import { DesignRuntime } from "../runtime/DesignRuntime/DesignRuntime";

const isInsideRect = (element: HTMLElement, event: MouseEvent) => {
  const domRect = element.getBoundingClientRect();
  if (
    event.clientX >= domRect.left &&
    event.clientX <= domRect.right &&
    event.clientY >= domRect.top &&
    event.clientY <= domRect.bottom
  ) {
    return true;
  }
  return false;
};

export const selectParent = (event: MouseEvent) => {
  const parent = DesignRuntime.getChildAcceptors().find((ID) => {
    if (
      DesignRuntime.getState()[ID].ref &&
      DesignRuntime.getState()[ID].ref.current
    ) {
      return isInsideRect(DesignRuntime.getState()[ID].ref.current!, event);
    } else {
      throw new Error("child acceptors should have ref");
    }
  });
  return parent || "root";
};
