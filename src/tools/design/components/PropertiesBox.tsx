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
import { DisplayProperty } from "../rxjs/DrawState";
import { PropertyItem, PropertyRegistry } from "../rxjs/PropertyRegistry";

export const PropertiesBox: React.FC = (props) => {
  const [registeredProperties, setRegisteredProperties] = useState<{
    [pkgSlashKey: string]: PropertyItem;
  }>({});
  useEffect(() => {
    const subscription = PropertyRegistry.subscribe({
      next: (v) => {
        setRegisteredProperties(v);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setRegisteredProperties]);

  const [ID, setID] = useState<string>();
  const [properties, setProperties] =
    useState<{ propertyName: string; value: string; type: string }[]>();
  const [appearance, setAppearance] =
    useState<{ propertyName: string; value: string; type: string }[]>();
  useState<{ propertyName: string; value: string; type: string }[]>();
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
  const [activeHeader, setActiveHeader] = useState<string>("");
  // listen to DisplayProperty
  useEffect(() => {
    // Simplification-6 DisplayProperty should get ID instead of bus
    const subscription = DisplayProperty.subscribe({
      next: (v) => {
        if (v) {
          setID(v.ID);
          setProperties(v.Properties);
          setAppearance(v.Appearance);
          setActiveHeader(v.activeHeader);
        }
        setComps([]); // remove existing visible components
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setID, setProperties, setComps]);

  // show properties
  useEffect(() => {
    if (properties && ID && registeredProperties) {
      const newComps: [
        React.FC<any>,
        {
          ID: string;
          propertyName: string;
          initialValue: string;
        }
      ][] = [];
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        const type = property.type;
        if (registeredProperties[type]) {
          newComps.push([
            registeredProperties[type].comp,
            {
              ID,
              propertyName: property.propertyName,
              initialValue: property.value,
            },
          ]);
        }
      }
      setComps(newComps);
    }
  }, [properties, setComps, ID, registeredProperties]);

  return (
    <div style={{ borderLeft: "1px solid black", height: "100%" }}>
      <div style={{ borderBottom: activeHeader ? "1px solid gray" : "" }}>
        {activeHeader && activeHeader === "Properties" ? (
          <span>
            <b>Properties</b>
          </span>
        ) : (
          <span>Properties</span>
        )}
        {activeHeader && activeHeader === "Appearance" ? (
          <span>
            <b>Appearance</b>
          </span>
        ) : (
          <span>Appearance</span>
        )}
      </div>

      {comps.map(([Comp, props]) => {
        return <Comp {...props} key={props.propertyName} />;
      })}
    </div>
  );
};
