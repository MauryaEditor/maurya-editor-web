import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

export const useAcceptChild = (
  bus: BehaviorSubject<{ acceptchild?: string }>
) => {
  const [children, setChildren] = useState<string[]>([]);
  useEffect(() => {
    const subscription = bus.subscribe({
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
  }, [bus, setChildren]);
  return children;
};
