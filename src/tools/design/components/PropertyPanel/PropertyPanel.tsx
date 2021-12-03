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
import React from "react";
import { PropertyPanelHeader } from "../../types/PropertyPanelHeaders";
import { Header } from "./components/Header";
import { useGetHeaders } from "./useGetHeaders";
import { useSubscribePropertyBus } from "./useSubscribePropertyBus";
export const PropertyPanel: React.FC = React.memo((props) => {
  const headers = useGetHeaders();
  const comps = useSubscribePropertyBus();
  return (
    <div
      style={{
        borderLeft: "1px solid #BFDBFE",
        height: "100%",
        background: "#EFF6FF",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid #BFDBFE",
          fontWeight: "bold",
          fontSize: "0.8em",
          display: "flex",
          justifyContent: "space-around",
          paddingTop: "1em",
          paddingBottom: "1em",
          color: "#1E40AF",
        }}
      >
        {/** header item goes here*/}
        {headers.map((header) => {
          return (
            <Header
              name={header}
              activeHeader={comps?.activeHeader}
              key={header}
            />
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.2em",
          padding: "1.2em",
        }}
      >
        {/** property element goes here*/}
        {comps?.comps.map((Comp) => {
          console.log("rendering options");
          return (
            <Comp.Comp {...Comp.props} key={Comp.props.name + Comp.props.ID} />
          );
        })}
      </div>
    </div>
  );
});
