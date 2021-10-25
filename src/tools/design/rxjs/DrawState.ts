import { BehaviorSubject } from "rxjs";
import { ComponentItem } from "./ComponentRegistry";

export const DesignComponentSelected =
	new BehaviorSubject<ComponentItem | null>(null);

// store ID: Bus
export const DrawRuntimeState: { [ID: string]: { bus: BehaviorSubject<any> } } =
	{};

export const DrawRuntimeBus = new BehaviorSubject<
	({ [key: string]: any } & { ID: string }) | null
>(null);

DrawRuntimeBus.subscribe({
	next: (v) => {
		if (v && v.bus) DrawRuntimeState[v?.ID] = { bus: v.bus, ...v };
	},
});
