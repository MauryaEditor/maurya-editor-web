import React, { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
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
	return <input type="text" style={{ ...style }} {...attrs} />;
};

const manifest = {
	key: "Inputbox",
	comp: SimpleComponent,
	props: { name: "Inputbox" },
	ondragComp: SimpleDragComponent,
	ondragProps: { name: "Inputbox" },
	renderComp: RenderComp,
	renderCompProps: () => {
		return {
			style: {} as React.CSSProperties,
			bus: new BehaviorSubject<any>({}),
		};
	},
};

export default manifest;
