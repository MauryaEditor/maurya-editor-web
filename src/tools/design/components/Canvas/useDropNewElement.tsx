import React, { useEffect } from "react";
import { PostCreateEvent } from "../../../../runtime/commands";
import getCoords from "../../lib/getCoords";
import { selectParent } from "../../lib/selectParent";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { CanvasScale } from "../../runtime/interaction-states/CanvasScale";
import { SelectedDesignElement } from "../../runtime/interaction-states/SelectedDesignElement";

export const useDropNewElement = (
  subcontainerRef: React.RefObject<HTMLElement>,
  rootRef: React.RefObject<HTMLElement>
) => {
  useEffect(() => {
    if (subcontainerRef.current) {
      const onmouseup = (event: MouseEvent) => {
        if (SelectedDesignElement.value) {
          const parent = selectParent(event);
          let { top, left } = getCoords(rootRef.current!);
          if (parent !== "root") {
            ({ top, left } = getCoords(
              DesignRuntime.getState()[parent].ref.current!
            ));
          }
          PostCreateEvent({
            compKey: SelectedDesignElement.value.key,
            pkg: "design",
            state: {
              style: {
                position: "absolute",
                top: `${(event.clientY - top) / CanvasScale.value + 10}px`,
                left: `${(event.clientX - left) / CanvasScale.value + 10}px`,
              },
              parent: parent,
            },
          });
          SelectedDesignElement.next(null);
        }
      };
      subcontainerRef.current.addEventListener("mouseup", onmouseup);
      return () => {
        subcontainerRef.current?.removeEventListener("mouseup", onmouseup);
      };
    }
  }, [subcontainerRef, rootRef]);
};
