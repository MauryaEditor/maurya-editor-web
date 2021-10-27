import React, { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { TextProperty } from "../properties/TextProperty";
import { DisplayProperty, PropertyMap } from "../rxjs/DrawState";

export const PropertiesBox: React.FC = (props) => {
	const [bus, setBus] = useState<BehaviorSubject<any>>();
	const [properties, setProperties] = useState<PropertyMap>();
	const [comps, setComps] = useState<
		[
			React.FC<any>,
			{
				bus: BehaviorSubject<any>;
				propertyName: string;
				initialValue: string;
			}
		][]
	>([]);
	// listen to DisplayProperty
	useEffect(() => {
		// Simplification-6 DisplayProperty should get ID instead of bus
		DisplayProperty.subscribe({
			next: (v) => {
				setBus(v?.bus);
				setProperties(v?.properties);
				setComps([]);
			},
		});
	}, [setBus, setProperties, setComps]);

	// show properties
	useEffect(() => {
		if (properties && bus) {
			const propertyNames = Object.keys(properties);
			for (let i = 0; i < propertyNames.length; i++) {
				if (properties[propertyNames[i]].type === "TextProperty") {
					setComps((old) => {
						return [
							...old,
							[
								TextProperty,
								// Simplification-9 Send ID instead of bus
								{
									bus,
									propertyName: propertyNames[i],
									initialValue:
										properties[propertyNames[i]].value,
								},
							],
						];
					});
				}
			}
		}
	}, [properties, setComps]);

	return (
		<div style={{ borderLeft: "1px solid black", height: "100%" }}>
			{comps.map(([Comp, props]) => {
				return <Comp {...props} key={props.propertyName} />;
			})}
		</div>
	);
};
