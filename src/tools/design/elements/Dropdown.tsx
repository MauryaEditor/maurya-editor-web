import React, { useEffect, useState } from "react";
import { useAttachProperty } from "./hooks/useAttachProperty";
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

	// attach properties
	const Options = useAttachProperty(
		props.ID,
		"ArrayProperty<string>",
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
	renderComp: RenderComp,
	renderCompProps: () => {
		return {
			style: {} as React.CSSProperties,
		};
	},
};

export default manifest;
