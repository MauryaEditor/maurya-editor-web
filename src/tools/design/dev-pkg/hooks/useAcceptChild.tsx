import { useEffect, useState } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { useBus } from "./useBus";

export const useAcceptChild = (ID: string) => {
  const bus = useBus(ID);
  const [children, setChildren] = useState<string[]>([]);
  useEffect(() => {
    DesignRuntime.registerParent(ID);
    return () => {
      DesignRuntime.removeParent(ID);
    };
  }, [ID]);
  useEffect(() => {
    const subscription = bus.subscribe({
      next: (v) => {
        if (v && v["acceptchild"]) {
          setChildren((children) => {
            return [...children, v["acceptchild"]!];
          });
        }
        if (v && v["removechild"]) {
          setChildren((children) => {
            return children.filter((child) => {
              return child !== v["removechild"];
            });
          });
        }
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [ID, bus, setChildren]);
  return children;
};
