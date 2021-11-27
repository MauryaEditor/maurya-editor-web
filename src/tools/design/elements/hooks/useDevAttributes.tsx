import { createRef, useEffect, useState } from "react";
import { DragElement, DrawRuntimeState } from "../../rxjs/DrawState";

export function useDevAttributes<T extends HTMLElement>(
  ID: string,
  ref?: React.RefObject<T>
) {
  const [attributes, setAttributes] = useState<{
    ref?: React.RefObject<T>;
    draggable: boolean;
  }>({ draggable: false, ref: ref || createRef<T>() });
  useEffect(() => {
    if (attributes.ref) {
      DrawRuntimeState[ID].ref = attributes.ref;
    }
  }, [attributes, attributes.ref]);
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
  }, [attributes, attributes.ref, ID]);
  return attributes;
}
