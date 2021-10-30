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
import React, { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { JsxElement } from "typescript";

export interface PropertiesComponentProps {
	type: string;
	name: string;
	values: (string | number | boolean)[];
	bus: BehaviorSubject<any>;
}

export const PropertiesComponent: React.FC<PropertiesComponentProps> = (
	props
) => {
	const [Comp, setComp] = useState<React.FC>();
	useEffect(() => {
		if (props.type) {
		}
	}, [props.type]);
	return <div>{Comp ? <Comp /> : null}</div>;
};
