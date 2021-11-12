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
import { useAttachProperty } from "./hooks/useAttachProperty";
import { useStyle } from "./hooks/useStyle";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";

const Textbox: React.FC<RenderProps> = (props) => {
  const [style, setStyle] = useStyle(props.ID, props.style!);
  const TextValue = useAttachProperty<string>(
    props.ID,
    "design/text",
    "Value",
    props.properties?.Value || ""
  );
  return <div style={{ ...style }}>{TextValue || "Text here"}</div>;
};

const manifest = {
  key: "Textbox",
  comp: SimpleComponent,
  props: { name: "Textbox" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "Textbox" },
  renderComp: Textbox,
  renderCompProps: () => {
    return {
      style: {} as React.CSSProperties,
    };
  },
};

export default manifest;
