import React, { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { DisplayProperty, DrawRuntimeState } from "../rxjs/DrawState";
import { AttachProperty } from "./hooks/AttachProperty";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";

const RenderComp: React.FC<RenderProps> = (props) => {
	const [style, setStyle] = useState(props.style!);
	const [children, setChildren] = useState(props.children!);
	const [attrs, setAttrs] = useState(props.attributes!);
	const [bus, setBus] = useState<BehaviorSubject<any>>(props.bus);

	// render component again if props changes
	// can be used from places where acces to component is available
	useEffect(() => {
		setStyle(props.style!);
	}, [props.style, setStyle]);
	useEffect(() => {
		setChildren(props.children!);
	}, [props.children, setChildren]);
	useEffect(() => {
		setAttrs(props.attributes!);
	}, [props.attributes, setAttrs]);

	// listen to patch events
	useEffect(() => {
		bus.subscribe({
			next: (v) => {
				if (v.style) {
					setStyle((old: React.CSSProperties | undefined) => {
						return { ...old!, ...v.style };
					});
				}
				if (v.children) {
					setChildren((old: string | HTMLElement | undefined) => {
						return v.children;
					});
				}
			},
		});
	}, [setStyle, setChildren, bus]);

	// attach properties
	const TextValue = AttachProperty(
		props.ID!,
		"TextProperty",
		"Value",
		props.children
	);

	// Simplification-10 Dislayproperty sends ID instead of bus
	// TODO: move this effect to when component is selected
	useEffect(() => {
		DisplayProperty.next({
			bus: DrawRuntimeState[props.ID!].bus,
			properties: { ...DrawRuntimeState[props.ID!].properties },
		});
	}, []);
	return (
		<button style={{ ...style }} {...attrs}>
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
	renderComp: RenderComp,
	renderCompProps: () => {
		return {
			style: {} as React.CSSProperties,
			bus: new BehaviorSubject<any>({}),
			children: "Button",
		};
	},
};

export default manifest;
