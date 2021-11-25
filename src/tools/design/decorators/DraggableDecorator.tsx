import { useRef } from "react";
import { useStyle } from "./hooks/useStyle";

export interface DraggableDecoratorProps {
  ID: string;
  style?: React.CSSProperties;
}

export const DraggableDecorator: React.FC<DraggableDecoratorProps> = (
  props
) => {
  const [style, setStyle] = useStyle(props.ID, props.style!);
  const ref = useRef<HTMLDivElement>(null);
  // TODO: ondrag set a subject
  return (
    <div draggable={true} style={{ ...style }} ref={ref}>
      {props.children}
    </div>
  );
};
