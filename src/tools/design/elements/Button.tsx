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
import React, { useEffect } from "react";
import { DisplayProperty, DrawRuntimeState } from "../rxjs/DrawState";
import { useAttachProperty } from "./hooks/useAttachProperty";
import { useStyle } from "./hooks/useStyle";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";

const RenderComp: React.FC<RenderProps> = (props) => {
	const [style, setStyle] = useStyle(props.ID, props.style!);
	// attach properties
	const TextValue = useAttachProperty<string>(
		props.ID,
		"TextProperty",
		"Value",
		props.properties?.Value || ""
	);

	// Simplification-10 Dislayproperty sends ID instead of bus
	// TODO: move this effect to when component is selected
	useEffect(() => {
		DisplayProperty.next({
			ID: props.ID,
			properties: { ...DrawRuntimeState[props.ID!].properties },
		});
	}, []);
	return <button style={{ ...style }}>{TextValue}</button>;
};

const manifest = {
	key: "Button",
	comp: SimpleComponent,
	props: { name: "Button" },
	ondragComp: SimpleDragComponent,
	ondragProps: { name: "Button" },
	renderComp: RenderComp,
	renderCompProps: () => {
		return {
			style: {} as React.CSSProperties,
			children: "Button",
		};
	},
};

export default manifest;
