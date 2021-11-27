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
import React, { useRef } from "react";
import { SelectedDesignElement } from "../../runtime/interaction-states/SelectedDesignElement";
import { ELementPanel } from "../ElementPanel/ElementPanel";
import { useManageCursor } from "./useManageCursor";

export const DesignContainer: React.FC = (props) => {
  const combinedContainer = useRef<HTMLDivElement>(null);
  const cursor = useManageCursor(
    combinedContainer,
    SelectedDesignElement,
    "grabbing"
  );

  return (
    <div style={{ display: "flex", height: "100%", userSelect: "none" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          cursor: cursor,
          position: "relative",
        }}
        ref={combinedContainer}
      >
        <div
          style={{
            width: "8em",
            overflow: "hidden",
          }}
        >
          <ELementPanel />
        </div>
        {/* <div style={{ flex: 1, overflow: "hidden" }}>
          <CanvasBox />
        </div> */}
      </div>
      {/* <div style={{ width: "14em", overflow: "hidden" }}>
        <PropertiesBox />
      </div> */}
    </div>
  );
};
