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
				propertyOrder: DrawRuntimeState[ID].propertyOrder
					? !DrawRuntimeState[ID].propertyOrder?.includes(
							propertyName
					  )
						? [...DrawRuntimeState[ID].propertyOrder!, propertyName]
						: [...DrawRuntimeState[ID].propertyOrder!]
					: [propertyName],
			},
		});
	}, [value, ID, propertyName, propertyType]);

	// subscribe for changes
	useEffect(() => {
		if (bus) {
			const subscription = bus.subscribe({
				next: (v) => {
					if (
						v["properties"] &&
						v["properties"][propertyName] !== undefined
					) {
						setValue(v["properties"][propertyName]);
					}
				},
			});
			return () => {
				subscription.unsubscribe();
			};
		}
	}, [bus, propertyName, setValue]);

	return value;
}
