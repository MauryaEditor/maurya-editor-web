import React, { useEffect, useState } from "react";
import { DraggableDecorator } from "../../decorators/DraggableDecorator";
import { PostElementRenderedDecorator } from "../../decorators/PostElementRenderedDecoratot";
import { RenderDecorator } from "../../decorators/RenderDecorator";
import { DesignElementRegistry } from "../../registry/DesignElementRegistry";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { RenderProps } from "../../types/RenderProps";

export interface RenderElementsProps {
  children: string[];
}

export interface RenderableElementDescription {
  Comp: React.FC<any & RenderProps>;
  props: any & RenderProps;
  ID: string;
  decorators: React.FC<{ ID: string }>[];
  ref: React.RefObject<HTMLElement>;
}

export const RenderElements: React.FC<RenderElementsProps> = (props) => {
  const [comps, setComps] = useState<RenderableElementDescription[]>([]);
  useEffect(() => {
    const newComps = props.children.map(
      (childID): RenderableElementDescription => {
        const compKey = DesignRuntime.getState()[childID].compKey;
        const designElement = DesignElementRegistry.getElementByKey(compKey);
        if (!designElement) {
          throw new Error(
            "Tried rendering an element not registered with DesignElementRegistry"
          );
        }
        const decorators = [PostElementRenderedDecorator, DraggableDecorator]; // default decorators
        const ref = DesignRuntime.getRefFor(childID);
        if (designElement.decorators) {
          decorators.push(...designElement.decorators);
        }
        return {
          Comp: designElement.renderComp,
          props: { ...designElement.renderCompProps, ID: childID },
          ID: childID,
          decorators: decorators,
          ref: ref,
        };
      }
    );
    setComps(newComps);
  }, [props.children, setComps]);
  return (
    <>
      {comps.map((comp) => {
        const Comp = comp.Comp;
        return (
          <RenderDecorator
            decorators={comp.decorators}
            ID={comp.ID}
            key={comp.ID}
          >
            <Comp {...comp.props} key={comp.ID} ref={comp.ref} />
          </RenderDecorator>
        );
      })}
    </>
  );
};
