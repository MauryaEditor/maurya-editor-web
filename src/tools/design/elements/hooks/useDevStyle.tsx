import React, { useEffect, useState } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { useBus } from "../../dev-pkg/hooks/useBus";

export const useDevStyle = (ID: string) => {
  const bus = useBus(ID);
  const [style, setStyle] = useState<React.CSSProperties>(
    DesignRuntime.getStateFor(ID).state.style
  );
  useEffect(() => {
    const subscription = bus.subscribe({
      next: (v) => {
        if (v && v["state"] && v["state"]["style"]) {
          setStyle(DesignRuntime.getStateFor(ID).state.style);
        }
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [bus, setStyle]);
  return style;
};
