import React from "react";
import { PropertyPanelHeader } from "../../../types/PropertyPanelHeaders";

export interface HeaderProps {
  name: PropertyPanelHeader;
  activeHeader?: PropertyPanelHeader;
}
export const Header: React.FC<HeaderProps> = React.memo((props) => {
  return (
    <>
      {props.activeHeader && props.activeHeader === props.name ? (
        <span>{props.name}</span>
      ) : (
        <span onClick={() => {}} style={{ color: "#94A3B8" }}>
          {props.name}
        </span>
      )}
    </>
  );
});
