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
import { useRef } from "react";
import { useAutoResize } from "./useAutoResize";
import "./Canvas.css";
import { useDropNewElement } from "./useDropNewElement";
import { useRegisterWithDesignRuntime } from "./useRegisterWithDesignRuntime";
import { useAcceptChild } from "./useAcceptChild";
import { RenderElements } from "./RenderElements";
import { useRepositionHandler } from "./useRepositionHandler";
import React from "react";

export const Canvas: React.FC = React.memo((props) => {
  const ref = useRef<HTMLDivElement>(null);
  const subcontainerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scale = useAutoResize(ref);
  useDropNewElement(subcontainerRef, rootRef);
  const children = useAcceptChild();
  useRegisterWithDesignRuntime(rootRef);
  useRepositionHandler(subcontainerRef);
  return (
    <div className={"canvas-container"} ref={ref}>
      <div
        className={"canvas-subcontainer"}
        style={{
          transform: `scale(${scale})`,
          width: scale ? `${100 / scale}%` : "",
          height: scale ? `${100 / scale}%` : "",
        }}
        ref={subcontainerRef}
      >
        <div className={"canvas-root"} ref={rootRef}>
          <RenderElements children={children} />
        </div>
      </div>
    </div>
  );
});
