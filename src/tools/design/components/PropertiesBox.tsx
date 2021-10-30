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
		const subscription = DisplayProperty.subscribe({
			next: (v) => {
				setID(v?.ID);
				setProperties(v?.properties);
				setComps([]);
			},
		});
		return () => {
			subscription.unsubscribe();
		};
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
