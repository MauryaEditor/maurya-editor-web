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
