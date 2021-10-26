import { useEffect, useState } from "react";
import { DrawRuntimeBus, DrawRuntimeState } from "../../rxjs/DrawState";

// TODO: Make the
export const AttachProperty = (
	tempID: string,
	propertyType: string,
	propertyName: string,
	initialValue: any
) => {
	const [value, setValue] = useState<any>(initialValue);
	const bus = DrawRuntimeState[tempID].bus;
	if (!bus) {
		throw new Error(`Bus is not defined for tempID: ${tempID}`);
	}

	// attach property
	useEffect(() => {
		DrawRuntimeBus.next({
			ID: tempID,
			payload: {
				properties: {
					...DrawRuntimeState[tempID].properties!,
					[propertyName]: { value: initialValue, type: propertyType },
				},
			},
		});
	}, []);

	// subscribe for changes
	useEffect(() => {
		bus.subscribe({
			next: (v) => {
				if (
					v["properties"] &&
					v["properties"][propertyName] != undefined
				) {
					setValue(v["properties"][propertyName]);
				}
			},
		});
	}, [bus, propertyName, setValue]);

	return value;
};
