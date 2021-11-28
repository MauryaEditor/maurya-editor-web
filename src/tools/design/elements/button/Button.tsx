import React from "react";
import { DesignElement } from "../../types/DesignElement";
import { RenderProps } from "../../types/RenderProps";
import { useDevStyle } from "../hooks/useDevStyle";
import { SimpleComponent } from "../utils/SimpleComponent/SimpleComponent";
import { SimpleDragComponent } from "../utils/SimpleDragComponent/SimpleDragComponent";

export const Button = React.forwardRef<HTMLButtonElement, RenderProps>(
  (props, ref) => {
    const devStyle = useDevStyle(props.ID);
    console.log(devStyle);
    return (
      <button ref={ref} style={{ ...devStyle }}>
        Button
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
};

export default manifest;
