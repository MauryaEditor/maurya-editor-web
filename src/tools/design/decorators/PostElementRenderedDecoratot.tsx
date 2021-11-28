import { useEffect } from "react";
import { PostWebDevBusEvent } from "../../../runtime/commands";

export const DEV_ELEMENT_RENDERED = "ELEMENT_RENDERED";

export const PostElementRenderedDecorator: React.FC<{ ID: string }> = (
  props
) => {
  useEffect(() => {
    PostWebDevBusEvent({ type: DEV_ELEMENT_RENDERED, payload: props.ID });
  }, []);
  return <>{props.children}</>;
};
