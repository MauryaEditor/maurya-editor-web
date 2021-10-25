import React from "react";
import { BehaviorSubject } from "rxjs";
import TextBoxManifest from "../elements/Textbox";
import ButtonManifest from "../elements/Button";
import ImageManifest from "../elements/Image";
import CheckboxManifest from "../elements/Checkbox";
import InputboxManifest from "../elements/Inputbox";
import DropdownManifest from "../elements/Dropdown";
// TODO: write a better type
type RenderProps = {
	bus: BehaviorSubject<any>;
	style?: React.CSSProperties;
	children?: HTMLElement | string;
	attributes?: { [key: string]: string | number | boolean };
};
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
	InputboxManifest,
	CheckboxManifest,
	DropdownManifest,
	ButtonManifest,
	ImageManifest,
];

const outputList: ComponentItem[] = [TextBoxManifest as ComponentItem];

export const ComponentRegistry = new BehaviorSubject<ComponentList>([
	["Input", inputList],
	["Output", outputList],
]);
