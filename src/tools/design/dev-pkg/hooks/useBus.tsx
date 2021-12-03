import { useEffect, useState } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { ElementBus } from "../../types/ElementBus";

export const useBus = (ID: string) => {
  const [bus, setBus] = useState<ElementBus>(DesignRuntime.getState()[ID].bus);
  useEffect(() => {
    setBus(DesignRuntime.getState()[ID].bus);
  }, [DesignRuntime.getState()[ID].bus, ID]);
  return bus;
};
