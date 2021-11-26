import { createRef, useEffect, useState } from "react";
import { DragElement } from "../../rxjs/DrawState";

export function useDevAttributes<T extends HTMLElement>(
  ID: string,
  ref?: React.RefObject<T>
) {
  const [attributes, setAttributes] = useState<{
    ref?: React.RefObject<T>;
    draggable: boolean;
  }>({ draggable: true, ref: ref || createRef<T>() });
  useEffect(() => {
    if (attributes.ref?.current) {
      const element = attributes.ref.current;
      const onmousedown = (event: MouseEvent) => {
        console.log("drag element selected", ID);
        DragElement.next({ ID, ref: attributes.ref! });
      };
      element.addEventListener("mousedown", onmousedown, false);
      return () => {
        element.removeEventListener("mousedown", onmousedown, false);
      };
    }
  }, [attributes.ref, ID]);
  return attributes;
}
