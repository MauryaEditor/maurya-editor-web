/**
    Copyright 2021 Quaffles    
 
    This file is part of Maurya Editor.

    Maurya Editor is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    Maurya Editor is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <https://www.gnu.org/licenses/>.
 */
import React from "react";
import { BehaviorSubject } from "rxjs";
import TextBoxManifest from "../elements/Textbox";
import ButtonManifest from "../elements/Button";
import ImageManifest from "../elements/Image";
import CheckboxManifest from "../elements/Checkbox";
import InputboxManifest from "../elements/Inputbox";
import DropdownManifest from "../elements/Dropdown";
import { RenderProps } from "../elements/types/RenderProps";

// TODO: write a better type
export type ComponentItem = {
	key: string;
	comp: React.FC<object>;
	props: object;
	ondragComp: React.FC<object>;
	ondragProps: object;
	renderComp: React.FC<any>;
	renderCompProps: () => { [key: string | number]: any } & Omit<
		RenderProps,
		"ID"
	>;
};

export type ComponentList = [string, ComponentItem[]][];

const InputList: [string, ComponentItem[]] = [
	"Input",
	[
		InputboxManifest,
		CheckboxManifest,
		DropdownManifest,
		ButtonManifest,
		ImageManifest,
	],
];

const OutputList: [string, ComponentItem[]] = [
	"Output",
	[TextBoxManifest as ComponentItem],
];

export const ComponentRegistry = new BehaviorSubject<ComponentList>([
	InputList,
	OutputList,
]);
