import { BehaviorSubject } from "rxjs";
import React from "react";

declare var SubContainerStack: BehaviorSubject<React.FC[]>;

const Config = [
	{
		event: "AddMenu",
		package: "data",
		name: "Data",
		onclick: () => {},
		description: "Common data tools",
	},
];

export default Config;
