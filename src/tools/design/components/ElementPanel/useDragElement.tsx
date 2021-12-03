import { useEffect, useState } from "react";
import { SelectedDesignElement } from "../../runtime/interaction-states/SelectedDesignElement";

export const useDragElement = () => {
  const [cursor, setCursor] = useState<"default" | "grabbing">("default");
  useEffect(() => {
    const subscription = SelectedDesignElement.subscribe({
      next: (v) => {
        if (v) {
          setCursor("grabbing");
        } else {
          setCursor("default");
        }
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return cursor;
};
