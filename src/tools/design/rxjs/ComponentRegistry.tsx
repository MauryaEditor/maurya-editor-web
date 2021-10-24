import React, { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { SimpleComponent } from "../elements/utils/SimpleComponent";
import { SimpleDragComponent } from "../elements/utils/SimpleDragComponent";
import TextBoxManifest from "../elements/Textbox";
import ButtonManifest from "../elements/Button";
import ImageManifest from "../elements/Image";

// TODO: write a better type
type RenderProps = { bus: BehaviorSubject<any> };
export type ComponentItem = {
	key: string;
	comp: React.FC<object>;
	props: object;
	ondragComp: React.FC<object>;
	ondragProps: object;
	renderComp: React.FC<any>;
	renderCompProps: object & RenderProps;
};

export type ComponentList = [string, ComponentItem[]][];

const inputList: ComponentItem[] = [
	{
		key: "Inputbox",
		comp: SimpleComponent,
		props: { name: "Inputbox" },
		ondragComp: SimpleDragComponent,
		ondragProps: { name: "Inputbox" },
		renderComp: (props) => {
			return <input {...props} />;
		},
		renderCompProps: { bus: new BehaviorSubject<any>({}) },
	},
	{
		key: "Checkbox",
		comp: SimpleComponent,
		props: { name: "Checkbox" },
		ondragComp: SimpleDragComponent,
		ondragProps: { name: "Checkbox" },
		renderComp: (props) => {
			return <input type="checkbox" {...props} />;
		},
		renderCompProps: { bus: new BehaviorSubject<any>({}) },
	},
	{
		key: "Dropdown",
		comp: SimpleComponent,
		props: { name: "Dropdown" },
		ondragComp: SimpleDragComponent,
		ondragProps: { name: "Dropdown" },
		renderComp: (props) => {
			return (
				<select {...props}>
					<option>Add Options</option>
				</select>
			);
		},
		renderCompProps: { bus: new BehaviorSubject<any>({}) },
	},
	{
		key: "Searchbox",
		comp: SimpleComponent,
		props: { name: "Searchbox" },
		ondragComp: SimpleDragComponent,
		ondragProps: { name: "Searchbox" },
		renderComp: (props) => {
			return <div {...props}>No Searchbox available</div>;
		},
		renderCompProps: { bus: new BehaviorSubject<any>({}) },
	},
	ButtonManifest,
	ImageManifest,
];

const outputList: ComponentItem[] = [TextBoxManifest as ComponentItem];
export const ComponentRegistry = new BehaviorSubject<ComponentList>([
	["Input", inputList],
	["Output", outputList],
]);
