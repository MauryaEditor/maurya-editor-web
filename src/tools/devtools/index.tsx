import { BehaviorSubject } from "rxjs";
import React from "react";
import { DevTools } from "./DevTools";

declare var SubContainerStack: BehaviorSubject<React.FC[]>;

const Config = [
	{
		event: "AddMenu",
		package: "devtool",
		name: "Devtool",
		onclick: () => {
			SubContainerStack.next([DevTools]);
		},
		description: "Common design tools",
	},
];

export default Config;
