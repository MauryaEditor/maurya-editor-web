import React, { useEffect, useState } from "react";
import { TextProperty } from "../properties/TextProperty";
import { DisplayProperty, PropertyMap } from "../rxjs/DrawState";

export const PropertiesBox: React.FC = (props) => {
	const [ID, setID] = useState<string>();
	const [properties, setProperties] = useState<PropertyMap>();
	const [comps, setComps] = useState<
		[
			React.FC<any>,
			{
				ID: string;
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
				setID(v?.ID);
				setProperties(v?.properties);
				setComps([]);
			},
		});
	}, [setID, setProperties, setComps]);

	// show properties
	useEffect(() => {
		if (properties && ID) {
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
									ID,
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
	}, [properties, setComps, ID]);

	return (
		<div style={{ borderLeft: "1px solid black", height: "100%" }}>
			{comps.map(([Comp, props]) => {
				return <Comp {...props} key={props.propertyName} />;
			})}
		</div>
	);
};
