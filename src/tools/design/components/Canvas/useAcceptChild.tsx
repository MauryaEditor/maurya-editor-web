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
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setChildren]);
  return children;
};
