import { BehaviorSubject } from "rxjs";
import React from "react";
import { DesignContainer } from "./DesignContainer";

declare var SubContainerStack: BehaviorSubject<React.FC[]>;

const Config = [
	{
		event: "AddMenu",
		package: "design",
		name: "Design",
		onclick: () => {
			SubContainerStack.next([DesignContainer]);
		},
		description: "Common design tools",
	},
];

export default Config;
