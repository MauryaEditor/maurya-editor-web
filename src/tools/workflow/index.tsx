import { BehaviorSubject } from "rxjs";
import React from "react";

declare var SubContainerStack: BehaviorSubject<React.FC[]>;

const Config = [
	{
		event: "AddMenu",
		package: "workflow",
		name: "Workflow",
		onclick: () => {},
		description: "Common workflow tools",
	},
];

export default Config;
