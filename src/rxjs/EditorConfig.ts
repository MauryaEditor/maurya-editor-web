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
import { BehaviorSubject, ReplaySubject, Subject, Subscription } from "rxjs";

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
	ID: string;
	state?: { [key: string | number]: any };
}

export interface WebPatchData {
	ID: string;
	slice: { [key: string | number]: any };
}

export interface WebBusEvent {
	type: "CREATE" | "UPDATE" | "PATCH" | "DELETE"; // types of event
	payload: WebCreateData | WebPatchData; // payload
}

export const WebBus = new ReplaySubject<WebBusEvent>();

(window as any).SubscribeWebBus = (
	next: (v: WebBusEvent | null) => {}
): Subscription => {
	return WebBus.subscribe({ next });
};
