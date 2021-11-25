import React, { useEffect, useRef } from "react";
import { DraggableDecorator } from "../decorators/DraggableDecorator";
import { DropzoneDecorator } from "../decorators/DropzoneDecorator";
import { ElementDecorator } from "../decorators/ElementDecorator";
import { useMakeLayout } from "./hooks/useMakeLayout";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";

export const Section: React.FC<RenderProps> = (props) => {
  const children = useMakeLayout(props.ID);
  return (
    <div style={{ width: "200px", height: "200px", border: "1px solid black" }}>
      {children}
    </div>
  );
};

const manifest = {
  key: "Section",
  comp: SimpleComponent,
  props: { name: "Section" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "Section" },
  renderComp: Section,
  renderCompProps: () => {
    return {
      style: {} as React.CSSProperties,
      children: "Section",
    };
  },
  decorators: [DraggableDecorator, DropzoneDecorator, ElementDecorator],
};

export default manifest;
