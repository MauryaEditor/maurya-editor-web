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
import { useAttachAppearance } from "./hooks/useAttachAppearance";
import { useAttachProperty } from "./hooks/useAttachProperty";
import { useStyle } from "./hooks/useStyle";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";

const Button: React.FC<RenderProps> = (props) => {
  const [style, setStyle] = useStyle(props.ID, props.style!);
  // attach properties
  const TextValue = useAttachProperty<string>(
    props.ID,
    "design/text-required",
    "Value",
    props.properties?.Value || ""
  );

  const ToolTipValue = useAttachProperty<string>(
    props.ID,
    "design/text",
    "Tooltip",
    props.properties?.Value || ""
  );

  const Disabled = useAttachProperty<string>(
    props.ID,
    "design/boolean",
    "Disabled",
    props.properties?.Value || ""
  );

  const color = useAttachAppearance<string>(
    props.ID,
    "design/text",
    "Color",
    props.properties?.Color || ""
  );

  return (
    <button
      style={{
        ...style,
        color: color || "white",
        backgroundColor: "#2185D0",
        borderRadius: "6px",
        padding: "0.5rem 0.75rem 0.5rem 0.75rem",
        outline: "none",
        border: "none",
        fontSize: "0.75rem",
      }}
    >
      {TextValue}
    </button>
  );
};

const manifest = {
  key: "Button",
  comp: SimpleComponent,
  props: { name: "Button" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "Button" },
  renderComp: Button,
  renderCompProps: () => {
    return {
      style: {} as React.CSSProperties,
      children: "Button",
    };
  },
};

export default manifest;
