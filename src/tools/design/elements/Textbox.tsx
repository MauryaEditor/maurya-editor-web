import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";

const RenderComp: React.FC<any> = (props) => {
	const [style, setStyle] = useState(props.style);
	const [value, setValue] = useState(props.value);
	const [bus, setBus] = useState<BehaviorSubject<any>>(props.bus);
	useEffect(() => {
		setStyle((val: any) => {
			return { ...val, ...props.style };
		});
	}, [props.style, setStyle]);
	useEffect(() => {
		setValue(props.value);
	}, [props.value, setValue]);
	useEffect(() => {
		bus.subscribe({
			next: (v) => {
				if (v.style) {
					setStyle(v.style);
				}
				if (v.value) {
					setValue(v.value);
				}
			},
		});
	}, [setStyle, setValue, bus]);
	return <div style={{ ...style }}>{value}</div>;
};

const bus = new BehaviorSubject<any>({});

const manifest = {
	key: "Textbox",
	comp: SimpleComponent,
	props: { name: "Textbox" },
	ondragComp: SimpleDragComponent,
	ondragProps: { name: "Textbox" },
	renderComp: RenderComp,
	renderCompProps: {
		style: { width: "15em" },
		value: "Put some text here",
		bus: new BehaviorSubject<any>({}),
	},
};

export default manifest;
