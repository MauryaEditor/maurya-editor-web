import { BehaviorSubject } from "rxjs";

// TODO: write a better type
export type ComponentItem = {
	key: string;
	comp: React.FC<object>;
	props: object;
	ondragComp: React.FC<object>;
	ondragProps: object;
};

export type ComponentList = [string, ComponentItem[]][];

export const SimpleComponent: React.FC<object> = (props: any) => {
	return (
		<div style={{ height: "2em", position: "relative" }}>
			<span
				style={{
					position: "absolute",
					top: "50%",
					left: "0.5em",
					transform: "translate(0, -50%)",
				}}
			>
				{props.name}
			</span>
		</div>
	);
};

export const SimpleDragComponent: React.FC<object> = (props: any) => {
	return (
		<div style={{ border: "1px solid black", borderRadius: "2px" }}>
			{props.name}
		</div>
	);
};

const inputList: ComponentItem[] = [
	{
		key: "Inputbox",
		comp: SimpleComponent,
		props: { name: "Inputbox" },
		ondragComp: SimpleDragComponent,
		ondragProps: { name: "Inputbox" },
	},
	{
		key: "Checkbox",
		comp: SimpleComponent,
		props: { name: "Checkbox" },
		ondragComp: SimpleDragComponent,
		ondragProps: { name: "Checkbox" },
	},
	{
		key: "Dropdown",
		comp: SimpleComponent,
		props: { name: "Dropdown" },
		ondragComp: SimpleDragComponent,
		ondragProps: { name: "Dropdown" },
	},
	{
		key: "Searchbox",
		comp: SimpleComponent,
		props: { name: "Searchbox" },
		ondragComp: SimpleDragComponent,
		ondragProps: { name: "Searchbox" },
	},
];

export const ComponentRegistry = new BehaviorSubject<ComponentList>([
	["Input", inputList],
]);
