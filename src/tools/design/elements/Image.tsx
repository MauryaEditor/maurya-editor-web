import React, { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";
import AddImage from "./assets/add-image.png";
const RenderComp: React.FC<RenderProps> = (props) => {
	const [style, setStyle] = useState(props.style!);
	const [children, setChildren] = useState(props.children!);
	const [attrs, setAttrs] = useState({ src: AddImage, ...props.attributes! });
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
		setAttrs({ src: AddImage, ...props.attributes! });
	}, [props.attributes, setAttrs, AddImage]);

	// listen to patch events
	useEffect(() => {
		bus.subscribe({
			next: (v) => {
				if (v.style) {
					setStyle((old: React.CSSProperties | undefined) => {
						return { ...old!, ...v.style };
					});
				}
				if (v.attributes) {
					setChildren((old: string | HTMLElement | undefined) => {
						return v.attributes;
					});
				}
			},
		});
	}, [setStyle, setChildren, bus]);
	return <img {...attrs} style={{ ...style }} />;
};

const manifest = {
	key: "Image",
	comp: SimpleComponent,
	props: { name: "Image" },
	ondragComp: SimpleDragComponent,
	ondragProps: { name: "Image" },
	renderComp: RenderComp,
	renderCompProps: () => {
		return {
			style: {} as React.CSSProperties,
			bus: new BehaviorSubject<any>({}),
		};
	},
};

export default manifest;
