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
    console.log("posting web dev", props.ID);
    PostWebDevBusEvent({ type: DEV_ELEMENT_RENDERED, payload: props.ID });
  }, []);
  useEffect(() => {
    console.log("created child");
  }, []);
  return <>{props.children}</>;
};
