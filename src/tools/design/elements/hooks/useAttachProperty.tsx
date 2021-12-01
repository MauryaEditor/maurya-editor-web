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
    along with Quaffles.  If not, see <https://www.gnu.org/licenses/>.
 */
import { useEffect, useState } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { useBus } from "./useBus";
export function useAttachProperty<ReturnType>(
  ID: string,
  propertyName: string,
  propertyType: string
) {
  const bus = useBus(ID);
  const [value, setValue] = useState<ReturnType>();
  // attach property
  useEffect(() => {
    DesignRuntime.getState()[ID].propertyMap = [
      ...DesignRuntime.getState()[ID].propertyMap,
      { key: propertyName, type: propertyType },
    ];
  }, [propertyName, propertyType, ID]);
  // listen for changes
  useEffect(() => {
    bus.subscribe({
      next: (v) => {
        if (
          v &&
          v["state"] &&
          v["state"]["properties"] &&
          v["state"]["properties"][propertyName]
        ) {
          setValue(DesignRuntime.getState()[0].state.properties[propertyName]);
        }
      },
    });
  }, [bus, propertyName, propertyType, ID, setValue]);
  return value;
}
