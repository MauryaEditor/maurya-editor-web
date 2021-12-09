import React from "react";
import { SimpleComponent } from "../../dev-pkg/utils/SimpleComponent/SimpleComponent";
import { SimpleDragComponent } from "../../dev-pkg/utils/SimpleDragComponent/SimpleDragComponent";
import { DesignElement } from "../../types/DesignElement";
import { RenderProps } from "../../types/RenderProps";
import { useAttachProperty } from "../hooks/useAttachProperty";
import { useDevStyle } from "../hooks/useDevStyle";

export const Inputbox = React.forwardRef<HTMLInputElement, RenderProps>(
  (props, ref) => {
    const devStyle = useDevStyle(props.ID);
    const Value = useAttachProperty<string>(props.ID, "Value", "design/text");
    const Placeholder = useAttachProperty<string>(
      props.ID,
      "Placeholder",
      "design/text"
    );
    return (
      <input
        ref={ref}
        style={{ ...devStyle }}
        value={Value}
        placeholder={Placeholder}
      />
    );
  }
);

const manifest: DesignElement = {
  key: "TextBox",
  comp: SimpleComponent,
  props: { name: "TextBox" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "TextBox" },
  renderComp: Inputbox,
  renderCompProps: {},
};

export default manifest;
