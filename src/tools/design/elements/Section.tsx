import React, { useCallback, useEffect, useRef } from "react";
import { useAcceptChild } from "./hooks/useAcceptChild";
import { useDevAttributes } from "./hooks/useDevAttributes";
import { useDropzone } from "./hooks/useDropzone";
import { useModifyStyle } from "./hooks/useModifyStyle";
import { useStyle } from "./hooks/useStyle";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";

export const Section: React.FC<RenderProps> = (props) => {
  const [style, setStyle] = useStyle(props.ID, props.style!);
  const devAttrs = useDevAttributes(props.ID);
  const modifyStyleCallback = useCallback(
    (currentStyle: React.CSSProperties) => {
      const newStyle = { ...currentStyle };
      if (currentStyle.position === "absolute") {
        newStyle.position = "relative";
        newStyle.left = undefined;
        newStyle.top = undefined;
      }
      return newStyle;
    },
    []
  );
  useModifyStyle(setStyle, modifyStyleCallback);
  const ref = useRef<HTMLDivElement>(null);
  useDropzone({ ref, ID: props.ID });
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
        boxSizing: "border-box",
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
