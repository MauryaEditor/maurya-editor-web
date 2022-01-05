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
import { useEffect } from "react";
import { DesignRuntime } from "../runtime/DesignRuntime/DesignRuntime";
import { DraggedElement } from "../runtime/interaction-states/DraggedElement";

export const DraggableDecorator: React.FC<{ ID: string }> = (props) => {
  useEffect(() => {
    if (
      DesignRuntime.getRefFor(props.ID) &&
      DesignRuntime.getRefFor(props.ID).current
    ) {
      const component = DesignRuntime.getRefFor(props.ID).current!;
      const onmousedown = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        DraggedElement.next(props.ID);
      };
      component.addEventListener("mousedown", onmousedown);
      return () => {
        if (component) component.removeEventListener("mousedown", onmousedown);
      };
    }
  }, [props.ID]);
  return <>{props.children}</>;
};
