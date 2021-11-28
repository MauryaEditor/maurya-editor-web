import React from "react";
import { DesignElement } from "../../types/DesignElement";
import { RenderProps } from "../../types/RenderProps";
import { SimpleComponent } from "../utils/SimpleComponent/SimpleComponent";
import { SimpleDragComponent } from "../utils/SimpleDragComponent/SimpleDragComponent";

export const Button = React.forwardRef<HTMLButtonElement, RenderProps>(
  (props, ref) => {
    return <button ref={ref}>Button</button>;
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
