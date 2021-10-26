import { BehaviorSubject } from "rxjs";
import { ComponentItem } from "./ComponentRegistry";

export const DesignComponentSelected =
	new BehaviorSubject<ComponentItem | null>(null);

export type PropertyMap = { [key: string]: { value: any; type: string } };

// store ID: Bus
export const DrawRuntimeState: {
	[ID: string]: {
		bus: BehaviorSubject<any>;
		properties: PropertyMap;
	};
} = {};

export const DrawRuntimeBus = new BehaviorSubject<{
	ID: string;
	payload: {
		bus?: BehaviorSubject<any>;
		properties?: PropertyMap;
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
	bus: BehaviorSubject<any>;
	properties: PropertyMap;
} | null>(null);
