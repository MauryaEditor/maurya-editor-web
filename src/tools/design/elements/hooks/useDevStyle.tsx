import React, { useEffect, useState } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { useBus } from "./useBus";

export const useDevStyle = (ID: string) => {
  const bus = useBus(ID);
  const [style, setStyle] = useState<React.CSSProperties>(
    DesignRuntime.getState()[ID].state.style
  );
  useEffect(() => {
    bus.subscribe({
      next: (v) => {
        if (v && v["state"] && v["state"]["style"]) {
          setStyle(v["state"]["style"]);
        }
      },
    });
  }, [bus, setStyle]);
  return style;
};
