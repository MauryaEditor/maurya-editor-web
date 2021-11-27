import React, { useEffect } from "react";
import { SelectedDesignElement } from "../../runtime/interaction-states/SelectedDesignElement";

export const useDropNewElement = (
  subcontainerRef: React.RefObject<HTMLElement>
) => {
  useEffect(() => {
    if (subcontainerRef.current) {
      const onmouseup = () => {
        const rootElement = subcontainerRef.current;
        console.log("mouseup", SelectedDesignElement.value);
        if (SelectedDesignElement.value) {
          SelectedDesignElement.next(null);
        }
      };
      subcontainerRef.current.addEventListener("mouseup", onmouseup);
      return () => {
        subcontainerRef.current?.removeEventListener("mouseup", onmouseup);
      };
    }
  }, [subcontainerRef]);
};
