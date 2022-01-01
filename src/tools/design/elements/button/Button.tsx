import React, { MutableRefObject, useEffect } from "react";
import { DesignElement } from "../../types/DesignElement";
import { RenderProps } from "../../types/RenderProps";
import { useAttachProperty } from "../hooks/useAttachProperty";
import { useDevStyle } from "../hooks/useDevStyle";
import { SimpleComponent } from "../../dev-pkg/utils/SimpleComponent/SimpleComponent";
import { SimpleDragComponent } from "../../dev-pkg/utils/SimpleDragComponent/SimpleDragComponent";
import { AttachAliasDecorator } from "../../decorators/AttachAliasDecorator";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";

export const Button = React.forwardRef<HTMLButtonElement, RenderProps>(
  (props, ref) => {
    const devStyle = useDevStyle(props.ID);
    const TextValue = useAttachProperty<string>(
      props.ID,
      "Value",
      "design/text"
    );
    return (
      <button ref={ref} style={{ ...devStyle }}>
        {TextValue}
      </button>
    );
  }
);

const manifest: DesignElement = {
  key: "Button",
  comp: SimpleComponent,
  props: { name: "Button" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "Button" },
  renderComp: Button,
  renderCompProps: {},
  decorators: [AttachAliasDecorator],
};

export default manifest;
