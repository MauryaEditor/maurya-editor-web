import { useEffect, useState } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { useBus } from "./useBus";

export const useAcceptChild = (ID: string) => {
  const bus = useBus(ID);
  const [children, setChildren] = useState<string[]>([]);
  useEffect(() => {
    DesignRuntime.registerChildAcceptor(ID);
    return () => {
      DesignRuntime.deregisterChildAcceptor(ID);
    };
  }, [ID]);
  useEffect(() => {
    const subscription = bus.subscribe({
      next: (v) => {
        if (v && v["acceptchild"]) {
          setChildren((children) => {
            if (!children.includes(v["acceptchild"]!)) {
              return [...children, v["acceptchild"]!];
            }
            return [...children];
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
