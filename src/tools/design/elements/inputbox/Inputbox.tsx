import React from "react";
import { AttachAliasDecorator } from "../../decorators/AttachAliasDecorator";
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
  key: "Inputbox",
  comp: SimpleComponent,
  props: { name: "Inputbox" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "Inputbox" },
  renderComp: Inputbox,
  renderCompProps: {},
  decorators: [AttachAliasDecorator],
};

export default manifest;
