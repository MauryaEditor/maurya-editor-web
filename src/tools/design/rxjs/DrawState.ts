import { BehaviorSubject } from "rxjs";
import { ComponentItem } from "./ComponentRegistry";

export const DesignComponentSelected =
	new BehaviorSubject<ComponentItem | null>(null);

// store ID: Bus
export const DrawRuntimeState: { [ID: string]: { bus: BehaviorSubject<any> } } =
	{};

export const DrawRuntimeBus = new BehaviorSubject<{
	ID: string;
	bus?: BehaviorSubject<any>;
} | null>(null);

DrawRuntimeBus.subscribe({
	next: (v) => {
		if (v && v.bus) DrawRuntimeState[v?.ID] = { bus: v.bus };
	},
});
