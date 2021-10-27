import React from "react";
import { BehaviorSubject, Subject, Subscriber, Subscription } from "rxjs";

export interface MenuItem {
	name: string;
	onclick: () => {};
	description: string;
}

export const MenuConfig = new BehaviorSubject<{ [key: string]: MenuItem }>({});

export const OptionsConfig = new BehaviorSubject<any>({});

export interface ConfigEvent {
	package: string;
	event: string;
	name: string;
	onclick: () => {};
	description: string;
}

export const UpdateConfig = new Subject<ConfigEvent[]>();

(window as any).ConfigBus = UpdateConfig;

UpdateConfig.subscribe({
	next: (v) => {
		if (v instanceof Array) {
			for (let i = 0; i < v.length; i++) {
				switch (v[i]["event"]) {
					case "AddMenu":
						MenuConfig.next({
							...MenuConfig.value,
							[v[i].package]: {
								name: v[i].name,
								onclick: v[i].onclick,
								description: v[i].description,
							},
						});
						break;
					default:
						break;
				}
			}
		}
	},
});

export const ActiveMenu = new BehaviorSubject<string | null>(null);

export const ToolRegistry = new BehaviorSubject<{ [key: string]: any }>({});

// needed so that tools can find one another
export const RegisterTool = (pkg: string, value: any) => {
	ToolRegistry.next({ ...ToolRegistry.value, [pkg]: value });
};

export interface WebCreateData {
	compKey: string;
	pkg: string;
	tempID: string;
	props?: any;
}

export interface WebPatchData {
	tempID: string;
	style: React.CSSProperties;
}

export interface WebBusEvent {
	type: "CREATE" | "UPDATE" | "PATCH" | "DELETE"; // types of event
	payload: WebCreateData | WebPatchData; // payload
}

export const WebBus = new BehaviorSubject<WebBusEvent | null>(null);

(window as any).SubscribeWebBus = (
	next: (v: WebBusEvent | null) => {}
): Subscription => {
	return WebBus.subscribe({ next });
};
