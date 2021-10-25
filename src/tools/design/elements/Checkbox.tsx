import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";

const RenderComp: React.FC<any> = (props) => {
	const [style, setStyle] = useState(props.style);
	const [value, setValue] = useState(props.value);
	const [bus, setBus] = useState<BehaviorSubject<any>>(props.bus);
	useEffect(() => {
		console.log(props.style);
		setStyle(props.style);
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
	return <input type="checkbox" style={{ ...style }} />;
};

const bus = new BehaviorSubject<any>({});

const manifest = {
	key: "Checkbox",
	comp: SimpleComponent,
	props: { name: "Checkbox" },
	ondragComp: SimpleDragComponent,
	ondragProps: { name: "Checkbox" },
	renderComp: RenderComp,
	renderCompProps: {
		style: {},
		bus: new BehaviorSubject<any>({}),
	},
};

export default manifest;
