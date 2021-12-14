import React, { useEffect, useState } from "react";
import { PropertyPanelBus } from "../../bus/PropertyPanelBus";
import { PropertyRegistry } from "../../registry/PropertyRegistry";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { PropertyPanelHeader } from "../../types/PropertyPanelHeaders";
import { PropertyTypeProps } from "../../types/PropertyTypeProps";

export const useSubscribePropertyBus = () => {
  const [value, setValue] = useState<{
    activeHeader: PropertyPanelHeader;
    comps: { Comp: React.FC<PropertyTypeProps>; props: PropertyTypeProps }[];
  }>();
  useEffect(() => {
    const subscription = PropertyPanelBus.subscribe({
      next: (v) => {
        if (v && v.activeHeader && v.ID) {
          const propertyMap = DesignRuntime.getState()[v.ID].propertyMap;
          if (
            DesignRuntime.getState()[v.ID].isAliasable &&
            !propertyMap.find((m) => {
              return m.key === "Alias";
            })
          )
            propertyMap.push({
              key: "Alias",
              type: "design/text",
              slice: ["alias"],
            });
          const comps: {
            Comp: React.FC<PropertyTypeProps>;
            props: PropertyTypeProps;
          }[] = [];
          for (let i = 0; i < propertyMap.length; i++) {
            const property = PropertyRegistry.subject.value.find((value) => {
              if (value.type === propertyMap[i].type) {
                return true;
              }
              return false;
            });
            if (property) {
              comps.push({
                Comp: property.comp,
                props: {
                  ID: v.ID,
                  name: propertyMap[i].key,
                  slice: propertyMap[i].slice,
                },
              });
            }
          }
          setValue({ activeHeader: v.activeHeader, comps });
        }
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setValue]);
  return value;
};
