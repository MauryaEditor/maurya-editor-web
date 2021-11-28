import React, { useEffect } from "react";
import { selectParent } from "../../lib/selectParent";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { DraggedElement } from "../../runtime/interaction-states/DraggedElement";

export const useRepositionHandler = (
  containerRef: React.RefObject<HTMLElement>
) => {
  useEffect(() => {
    const subscription = DraggedElement.subscribe({
      next: (v) => {
        if (v) {
          // get current position with respect to canvas
          const canvasRootRect =
            DesignRuntime.getCanvasRoot().ref.current?.getBoundingClientRect()!;
          const elementRect =
            DesignRuntime.getState()[v].ref.current?.getBoundingClientRect()!;
          const top = elementRect.top - canvasRootRect.top;
          const left = elementRect.left - canvasRootRect.left;
          DesignRuntime.getState()[v].state.style = {
            ...DesignRuntime.getState()[v].state.style,
            top,
            left,
            position: "absolute",
          };
          // re-wire element to root
          const parent = DesignRuntime.getState()[v].state.parent;
          DesignRuntime.getState()[v].state.parent = "root";
          DesignRuntime.getState()[parent].bus.next({ removechild: v });
          DesignRuntime.getCanvasRoot().bus.next({ acceptchild: v });
        }
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (containerRef.current) {
      const onmousemove = (event: MouseEvent) => {
        // move dragged element if it exists
        if (DraggedElement.value) {
          const ID = DraggedElement.value;
          const canvasRect =
            DesignRuntime.getCanvasRoot().ref.current?.getBoundingClientRect()!;
          const elementRect =
            DesignRuntime.getState()[ID].ref.current?.getBoundingClientRect()!;
          DesignRuntime.getState()[ID].state.style = {
            ...DesignRuntime.getState()[ID].state.style,
            top: elementRect.top - canvasRect.top + event.movementY + "px",
            left: elementRect.left - canvasRect.left + event.movementX + "px",
          };
          DesignRuntime.getState()[ID].bus.next({
            state: DesignRuntime.getState()[ID].state,
          });
        }
      };
      const onmouseup = (event: MouseEvent) => {
        if (DraggedElement.value) {
          const ID = DraggedElement.value;
          const parent = selectParent(event);
          if (parent !== "root") {
            // re-wire to parent
            const parentRect =
              DesignRuntime.getState()[
                parent
              ].ref.current?.getBoundingClientRect()!;
            const elementRect =
              DesignRuntime.getState()[
                ID
              ].ref.current?.getBoundingClientRect()!;
            const top = elementRect.top - parentRect.top;
            const left = elementRect.left - parentRect.left;
            DesignRuntime.getState()[ID].state.style = {
              ...DesignRuntime.getState()[ID].state.style,
              top,
              left,
              position: "absolute",
            };
            DesignRuntime.getState()[ID].state.parent = parent;
            DesignRuntime.getCanvasRoot().bus.next({ removechild: ID });
            DesignRuntime.getState()[parent].bus.next({ acceptchild: ID });
            DraggedElement.next(null);
          } else {
            // no-need to re-wire
          }
          // TODO: PostPatchEvent with current style & current parent
        }
      };
      containerRef.current.addEventListener("mousemove", onmousemove);
      containerRef.current.addEventListener("mouseup", onmouseup);
      return () => {
        containerRef.current?.removeEventListener("mousemove", onmousemove);
        containerRef.current?.removeEventListener("mouseup", onmouseup);
      };
    }
  }, [containerRef]);
};
