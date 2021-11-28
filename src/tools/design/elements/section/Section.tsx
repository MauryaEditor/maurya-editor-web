import React from "react";
import { DesignElement } from "../../types/DesignElement";
import { SimpleComponent } from "../utils/SimpleComponent/SimpleComponent";
import { SimpleDragComponent } from "../utils/SimpleDragComponent/SimpleDragComponent";

export const Section = React.forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref}>Shyam is cool</div>;
});

const manifest: DesignElement = {
  key: "Section",
  comp: SimpleComponent,
  props: { name: "Section" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "Section" },
  renderComp: Section,
  renderCompProps: {},
};

export default manifest;
