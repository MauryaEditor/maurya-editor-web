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
import { checkIfPathExists } from "../lib/checkIfPathExists";
import { getValueFromSlice } from "../lib/getValueFromSlice";
import { updateSlice } from "../lib/updateSlice";
import { DesignRuntime } from "../runtime/DesignRuntime/DesignRuntime";
import { PropertyTypeProps } from "../types/PropertyTypeProps";

export const TextProperty: React.FC<PropertyTypeProps> = React.memo((props) => {
  const [value, setValue] = useState<string>("");
  const bus = DesignRuntime.getState()[props.ID].bus;
  // get initial value
  useEffect(() => {
    try {
      const value = getValueFromSlice(props.ID, props.slice);
      setValue(value);
    } catch {}
  }, [setValue, props.ID, props.slice]);
  // subscribe for changes
  useEffect(() => {
    bus.subscribe({
      next: (v) => {
        if (checkIfPathExists(v, props.slice)) {
          try {
            const value = getValueFromSlice(props.ID, props.slice);
            setValue(value);
          } catch (err) {
            console.error(err);
          }
        }
      },
    });
  }, [props.slice, setValue, bus]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4em" }}>
      <div style={{ color: "#1E40AF", fontWeight: 600, fontSize: "0.8em" }}>
        {props.name}
      </div>
      <input
        type="text"
        onChange={(event) => {
          // TODO: post to design runtime with onAccept
          updateSlice(
            DesignRuntime.getState()[props.ID].state,
            props.slice,
            event.target.value
          );
          bus.next(DesignRuntime.getState()[props.ID]);
        }}
        value={value}
        style={{
          outline: "none",
          paddingLeft: "1em",
          paddingRight: "1em",
          lineHeight: "2.5em",
          border: "1px solid #CBD5E1",
          backgroundColor: "transparent",
          borderRadius: "4px",
        }}
      />
    </div>
  );
});