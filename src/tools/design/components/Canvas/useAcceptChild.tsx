import { useEffect, useState } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";

export const useAcceptChild = () => {
  const [children, setChildren] = useState<string[]>([]);
  useEffect(() => {
    const subscription = DesignRuntime.getCanvasRoot().bus.subscribe({
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
  }, [setChildren]);
  return children;
};
