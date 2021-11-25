export const DraggableDecorator: React.FC = (props) => {
  return <div draggable={true}>{props.children}</div>;
};
