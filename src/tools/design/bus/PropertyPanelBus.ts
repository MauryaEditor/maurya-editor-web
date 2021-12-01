import { BehaviorSubject } from "rxjs";
import { PropertyPanelHeader } from "../types/PropertyPanelHeaders";

export interface PropertyPanelData {
  activeHeader: PropertyPanelHeader;
  ID?: string;
}

export const PropertyPanelBus = new BehaviorSubject<PropertyPanelData>({
  activeHeader: PropertyPanelHeader.Properties,
});
