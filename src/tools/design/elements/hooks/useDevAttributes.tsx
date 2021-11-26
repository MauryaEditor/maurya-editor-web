import { createRef, useEffect, useState } from "react";

export function useDevAttributes<T extends HTMLElement>(
  ref?: React.RefObject<T>
) {
  const [attributes, setAttributes] = useState<{
    ref?: React.RefObject<T>;
    draggable: boolean;
  }>({ draggable: true, ref: ref || createRef<T>() });
  useEffect(() => {
    if (attributes.ref?.current) {
      const element = attributes.ref.current;
      const ondragstart = (event: DragEvent) => {
        console.log("drag started");
        // remove from current element
        // stick it to canvasRoot
      };
      const ondragend = (event: DragEvent) => {
        console.log("drag ended");
        // add as child to last dragover element
      };
      element.addEventListener("dragstart", ondragstart, false);
      element.addEventListener("dragend", ondragend, false);
      return () => {
        element.removeEventListener("dragstart", ondragstart, false);
        element.removeEventListener("dragend", ondragend, false);
      };
    }
  }, [attributes.ref]);
  return attributes;
}
