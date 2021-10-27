import { useEffect, useState } from "react";
import { DrawRuntimeBus, DrawRuntimeState } from "../../rxjs/DrawState";
import { useBus } from "./useBus";

// TODO: Make the
export function useAttachProperty<ReturnType>(
	ID: string,
	propertyType: string,
	propertyName: string,
	initialValue: any
) {
	const [value, setValue] = useState<ReturnType>(initialValue);
	const bus = useBus(ID);

	// attach property
	useEffect(() => {
		DrawRuntimeBus.next({
			ID: ID,
			payload: {
				properties: {
					...DrawRuntimeState[ID].properties!,
					[propertyName]: { value: value, type: propertyType },
				},
			},
		});
	}, [value, ID, propertyName, propertyType]);

	// subscribe for changes
	useEffect(() => {
		if (bus)
			bus.subscribe({
				next: (v) => {
					if (
						v["properties"] &&
						v["properties"][propertyName] !== undefined
					) {
						setValue(v["properties"][propertyName]);
					}
				},
			});
	}, [bus, propertyName, setValue]);

	return value;
}
