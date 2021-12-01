import { useEffect } from "react";
import { PropertyPanelBus } from "../bus/PropertyPanelBus";
import { DesignRuntime } from "../runtime/DesignRuntime/DesignRuntime";
import { ElementSelected } from "../runtime/interaction-states/ElementSelected";
import { PropertyPanelHeader } from "../types/PropertyPanelHeaders";

export const SelectOnClick: React.FC<{ ID: string }> = (props) => {
  useEffect(() => {
    if (DesignRuntime.getState()[props.ID].ref) {
      const onclick = () => {
        ElementSelected.next(props.ID);
        PropertyPanelBus.next({
          ID: props.ID,
          activeHeader: PropertyPanelHeader.Properties,
        });
      };
      DesignRuntime.getState()[props.ID].ref.current?.addEventListener(
        "click",
        onclick
      );
      return () => {
        DesignRuntime.getState()[props.ID].ref.current?.removeEventListener(
          "click",
          onclick
        );
      };
    }
  }, [props.ID, DesignRuntime.getState()[props.ID].ref]);
  return <>{props.children}</>;
};
