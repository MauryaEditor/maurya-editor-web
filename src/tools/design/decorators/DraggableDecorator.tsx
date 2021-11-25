import { useStyle } from "./hooks/useStyle";

export interface DraggableDecoratorProps {
  ID: string;
  style?: React.CSSProperties;
}

export const DraggableDecorator: React.FC<DraggableDecoratorProps> = (
  props
) => {
  const [style, setStyle] = useStyle(props.ID, props.style!);

  return (
    <div draggable={true} style={{ ...style }}>
      {props.children}
    </div>
  );
};
