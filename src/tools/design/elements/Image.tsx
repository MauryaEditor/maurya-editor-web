import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";
import AddImage from "./assets/add-image.png";
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
	return (
		<img style={{ ...style }} src={value} alt={"Place your image here"} />
	);
};

const bus = new BehaviorSubject<any>({});

const manifest = {
	key: "Image",
	comp: SimpleComponent,
	props: { name: "Image" },
	ondragComp: SimpleDragComponent,
	ondragProps: { name: "Image" },
	renderComp: RenderComp,
	renderCompProps: {
		style: { width: "5em" },
		value: AddImage,
		bus: new BehaviorSubject<any>({}),
	},
};

export default manifest;
