import { PropertyPanelBus } from "../bus/PropertyPanelBus";
import { ElementSelected } from "../runtime/interaction-states/ElementSelected";
import { PropertyPanelHeader } from "../types/PropertyPanelHeaders";

export const selectElement = (ID: string) => {
  ElementSelected.next(ID);
  PropertyPanelBus.next({
    ID: ID,
    activeHeader:
      PropertyPanelBus.value.activeHeader || PropertyPanelHeader.Properties,
  });
};
