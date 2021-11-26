import React, { useRef } from "react";
import { useAcceptChild } from "./hooks/useAcceptChild";
import { useDevAttributes } from "./hooks/useDevAttributes";
import { useStyle } from "./hooks/useStyle";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";

export const Section: React.FC<RenderProps> = (props) => {
  const [style, setStyle] = useStyle(props.ID, props.style!);
  const devAttrs = useDevAttributes();
  const ref = useRef<HTMLDivElement>(null);
  const children = useAcceptChild(props.ID, ref);
  return (
    <div
      {...devAttrs}
      ref={ref}
      style={{
        ...style,
        width: "100%",
        height: "200px",
        border: "1px solid black",
      }}
    >
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
};

export default manifest;
