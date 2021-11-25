import { useEffect } from "react";

declare interface WebDevBusEvent {
  type: string;
  payload: any;
}

declare function PostWebDevBusEvent(event: WebDevBusEvent): void;

export interface ElementDecoratorProps {
  ID: string;
}

export const DEV_ELEMENT_RENDERED = "ELEMENT_RENDERED";

export const ElementDecorator: React.FC<ElementDecoratorProps> = (props) => {
  useEffect(() => {
    PostWebDevBusEvent({ type: DEV_ELEMENT_RENDERED, payload: props.ID });
  }, []);
  return <>{props.children}</>;
};
