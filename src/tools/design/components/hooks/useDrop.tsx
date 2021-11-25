import { useEffect } from "react";
import { DragOverElement } from "../../rxjs/DrawState";

export const useDrop = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (ref.current) {
      // TODO: set a subject that says over me being dragged
      const onmouseenter = (event: MouseEvent) => {
        console.log("mouseenter on root called");
        DragOverElement.next([...DragOverElement.value, "root"]);
      };
      const onmouseleave = (event: MouseEvent) => {
        console.log("mouseleave on rool called");
        DragOverElement.next(
          DragOverElement.value.slice(0, DragOverElement.value.length - 1)
        );
      };
      ref.current.addEventListener("mouseenter", onmouseenter, false);
      ref.current.addEventListener("mouseleave", onmouseleave, false);
      return () => {
        ref.current?.removeEventListener("mouseenter", onmouseenter, false);
        ref.current?.removeEventListener("mouseleave", onmouseleave, false);
      };
    }
  }, [ref]);
};
