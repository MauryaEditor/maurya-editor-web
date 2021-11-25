import { useEffect, useRef } from "react";
import { DragOverElement } from "../rxjs/DrawState";

export interface DropzoneDecoratorProps {
  ID: string;
  style?: React.CSSProperties;
}

export const DropzoneDecorator: React.FC<DropzoneDecoratorProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const onmouseenter = (event: MouseEvent) => {
        console.log("mouseenter in section");
        DragOverElement.next([...DragOverElement.value, props.ID]);
      };
      const onmouseleave = (event: MouseEvent) => {
        console.log("mouseleave in section");
        DragOverElement.value.slice(0, DragOverElement.value.length - 1);
      };
      ref.current.addEventListener("mouseenter", onmouseenter);
      ref.current.addEventListener("mouseleave", onmouseleave);
      return () => {
        ref.current?.removeEventListener("mouseenter", onmouseenter);
        ref.current?.removeEventListener("mouseleave", onmouseleave);
      };
    }
  }, [ref]);
  return <div ref={ref}>{props.children}</div>;
};
