import React, { useEffect, useState } from "react";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";
import { useBus } from "./hooks/useBus";
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
	return <img style={{ ...style }} alt={""} />;
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
			style: { width: "5em" } as React.CSSProperties,
		};
	},
};

export default manifest;
