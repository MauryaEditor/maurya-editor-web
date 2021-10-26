import React, { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { TextProperty } from "../properties/TextProperty";
import { DisplayProperty } from "../rxjs/DrawState";

export const PropertiesBox: React.FC = (props) => {
	const [bus, setBus] = useState<BehaviorSubject<any>>();
	const [properties, setProperties] =
		useState<{ [key: string]: { value: any; type: string } }>();
	// listen to DisplayProperty
	useEffect(() => {
		DisplayProperty.subscribe({
			next: (v) => {
				setBus(v?.bus);
				setProperties(v?.properties);
			},
		});
	}, [setBus, setProperties]);

	// show properties
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
