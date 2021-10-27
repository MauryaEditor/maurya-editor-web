import React, { useEffect, useState } from "react";
import { useBus } from "./hooks/useBus";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";

const RenderComp: React.FC<RenderProps> = (props) => {
	const [style, setStyle] = useState(props.style!);
	const bus = useBus(props.ID);

	// render component again if props changes
	// can be used from places where acces to component is available
	useEffect(() => {
		setStyle(props.style!);
	}, [props.style, setStyle]);

	// listen to patch events
	useEffect(() => {
		if (bus)
			bus.subscribe({
				next: (v) => {
					if (v.style) {
						setStyle((old: React.CSSProperties | undefined) => {
							return { ...old!, ...v.style };
						});
					}
				},
			});
	}, [setStyle, bus]);
	return <div style={{ ...style }}></div>;
};

const manifest = {
	key: "Textbox",
	comp: SimpleComponent,
	props: { name: "Textbox" },
	ondragComp: SimpleDragComponent,
	ondragProps: { name: "Textbox" },
	renderComp: RenderComp,
	renderCompProps: () => {
		return {
			style: {} as React.CSSProperties,
		};
	},
};

export default manifest;
