import { BehaviorSubject } from "rxjs";
import { ComponentItem } from "./ComponentRegistry";

export const DesignComponentSelected =
	new BehaviorSubject<ComponentItem | null>(null);

// store ID: Bus
export const DrawRuntimeState: {
	[ID: string]: {
		bus: BehaviorSubject<any>;
		properties: { [key: string]: { value: any; type: string } };
	};
} = {};

export const DrawRuntimeBus = new BehaviorSubject<{
	ID: string;
	payload: {
		bus?: BehaviorSubject<any>;
		properties?: { [key: string]: { value: any; type: string } };
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
	properties: { [key: string]: { value: any; type: string } };
} | null>(null);
