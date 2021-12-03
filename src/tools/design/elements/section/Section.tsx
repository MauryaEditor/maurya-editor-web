import React from "react";
import { RenderElements } from "../../components/Canvas/RenderElements";
import { AdjustChildPositionOnDrop } from "../../decorators/AdjustChildPositionOnDrop";
import { DesignElement } from "../../types/DesignElement";
import { RenderProps } from "../../types/RenderProps";
import { useAcceptChild } from "../../dev-pkg/hooks/useAcceptChild";
import { SimpleComponent } from "../../dev-pkg/utils/SimpleComponent/SimpleComponent";
import { SimpleDragComponent } from "../../dev-pkg/utils/SimpleDragComponent/SimpleDragComponent";

export const Section = React.forwardRef<HTMLDivElement, RenderProps>(
  (props, ref) => {
    const children = useAcceptChild(props.ID);
    return (
      <div
        ref={ref}
        style={{
          minHeight: "100px",
          width: "100%",
          border: "1px solid black",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <RenderElements children={children} />
      </div>
    );
  }
);

const manifest: DesignElement = {
  key: "Section",
  comp: SimpleComponent,
  props: { name: "Section" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "Section" },
  renderComp: Section,
  renderCompProps: { style: { minHeight: "100px" } },
  decorators: [AdjustChildPositionOnDrop],
};

export default manifest;
