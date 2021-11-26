import { useEffect } from "react";
import { DragOverElement } from "../../rxjs/DrawState";

export interface DropzoneProps {
  ID: string;
  ref: React.RefObject<HTMLElement>;
}

export const useDropzone = (props: DropzoneProps) => {
  useEffect(() => {
    if (props.ref.current) {
      const onmouseenter = (event: MouseEvent) => {
        console.log("mouseenter in section");
        DragOverElement.next([...DragOverElement.value, props.ID]);
      };
      const onmouseleave = (event: MouseEvent) => {
        console.log("mouseleave in section");
        DragOverElement.value.slice(0, DragOverElement.value.length - 1);
      };
      props.ref.current.addEventListener("mouseenter", onmouseenter);
      props.ref.current.addEventListener("mouseleave", onmouseleave);
      return () => {
        props.ref.current?.removeEventListener("mouseenter", onmouseenter);
        props.ref.current?.removeEventListener("mouseleave", onmouseleave);
      };
    }
  }, [props.ref]);
};
