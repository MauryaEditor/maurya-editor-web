import React from "react";
import { BehaviorSubject } from "rxjs";
import { ComponentItem } from "./ComponentRegistry";

export const DesignComponentSelected =
	new BehaviorSubject<ComponentItem | null>(null);

export type PropertyMap = { [key: string]: { value: any; type: string } };

// store ID: Bus
export const DrawRuntimeState: {
	[ID: string]: { [key: string | number]: any } & {
		bus: BehaviorSubject<any>;
		style: React.CSSProperties;
		properties: PropertyMap;
		renderProps: { [key: string | number]: any };
	};
} = {};

export const DrawRuntimeBus = new BehaviorSubject<{
	ID: string;
	payload: {
		bus?: BehaviorSubject<any>;
		style?: React.CSSProperties;
		properties?: PropertyMap;
		renderProps?: { [key: string | number]: any };
	};
} | null>(null);

DrawRuntimeBus.subscribe({
	next: (v) => {
		if (v)
			DrawRuntimeState[v.ID] = {
				...DrawRuntimeState[v.ID],
				...v.payload,
			};
	},
});

export const DisplayProperty = new BehaviorSubject<{
	ID: string;
	properties: PropertyMap;
} | null>(null);
