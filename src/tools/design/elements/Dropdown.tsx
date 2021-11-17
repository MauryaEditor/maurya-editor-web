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

const Dropdown: React.FC<RenderProps> = (props) => {
  const [style, setStyle] = useStyle(props.ID, props.style!);

  // attach properties
  const Alias = useAttachProperty<string>(
    props.ID,
    "design/alias",
    "Alias",
    props.properties?.Alias || ""
  );

  const Options = useAttachProperty<string[]>(
    props.ID,
    "ArrayProperty",
    "Options",
    props.properties?.Options || []
  );

  return <select style={{ ...style }}>{Options}</select>;
};

const manifest = {
  key: "Dropdown",
  comp: SimpleComponent,
  props: { name: "Dropdown" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "Dropdown" },
  renderComp: Dropdown,
  renderCompProps: () => {
    return {
      style: {} as React.CSSProperties,
    };
  },
};

export default manifest;
