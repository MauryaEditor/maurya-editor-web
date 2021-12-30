import { useEffect } from "react";
import { PropertyPanelBus } from "../bus/PropertyPanelBus";
import { DesignRuntime } from "../runtime/DesignRuntime/DesignRuntime";
import { ElementSelected } from "../runtime/interaction-states/ElementSelected";
import { PropertyPanelHeader } from "../types/PropertyPanelHeaders";

export const SelectOnClickDecorator: React.FC<{ ID: string }> = (props) => {
  useEffect(() => {
    if (DesignRuntime.getRefFor(props.ID)) {
      const onclick = () => {
        ElementSelected.next(props.ID);
        PropertyPanelBus.next({
          ID: props.ID,
          activeHeader: PropertyPanelHeader.Properties,
        });
      };
      DesignRuntime.getRefFor(props.ID).current?.addEventListener(
        "click",
        onclick
      );
      return () => {
        DesignRuntime.getRefFor(props.ID).current?.removeEventListener(
          "click",
          onclick
        );
      };
    }
  }, [props.ID, DesignRuntime.getRefFor(props.ID)]);
  return <>{props.children}</>;
};
