import React, { useState } from "react";

// TODO: write a better type
type ComponentItem = { key: string; comp: React.FC<object>; props: object };

type ComponentList = [string, ComponentItem[]][];

const SimpleComponent: React.FC<object> = (props: any) => {
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

const inputList: ComponentItem[] = [
	{
		key: "Inputbox",
		comp: SimpleComponent,
		props: { name: "Inputbox" },
	},
	{
		key: "Checkbox",
		comp: SimpleComponent,
		props: { name: "Checkbox" },
	},
	{
		key: "Dropdown",
		comp: SimpleComponent,
		props: { name: "Dropdown" },
	},
	{
		key: "Searchbox",
		comp: SimpleComponent,
		props: { name: "Searchbox" },
	},
];

export const ComponentBox: React.FC = (props) => {
	const [componentLists, setComponentLists] = useState<ComponentList>([
		["Input", inputList],
	]);
	return (
		<div style={{ borderRight: "1px solid black", height: "100%" }}>
			{componentLists.map((componentList) => {
				const category = componentList[0];
				const list = componentList[1];
				return (
					<div key={category}>
						<div
							style={{
								position: "relative",
								height: "2em",
								borderBottom: "1px solid black",
							}}
						>
							<span
								style={{
									position: "absolute",
									top: "50%",
									left: "0.5em",
									transform: "translate(0, -50%)",
									fontWeight: "bold",
								}}
							>
								{category}
							</span>

							<span
								style={{
									position: "absolute",
									top: "50%",
									right: "0.5em",
									transform: "translate(0, -50%)",
								}}
							>
								Arrow
							</span>
						</div>
						{list.map((item) => {
							const Comp = item.comp;
							return (
								<div key={item.key}>
									<Comp {...item.props} />
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
