import { useEffect, useState } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { ElementBus } from "../../types/ElementBus";

export const useBus = (ID: string) => {
  const [bus, setBus] = useState<ElementBus>(DesignRuntime.getBusFor(ID));
  useEffect(() => {
    setBus(DesignRuntime.getBusFor(ID));
  }, [DesignRuntime.getBusFor(ID)]);
  return bus;
};
