import React, { useEffect } from "react";
import getCoords from "../../lib/getCoords";
import { selectParent } from "../../lib/selectParent";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { CanvasScale } from "../../runtime/interaction-states/CanvasScale";
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
          const top =
            (elementRect.top - canvasRootRect.top) / CanvasScale.value + "px";
          const left =
            (elementRect.left - canvasRootRect.left) / CanvasScale.value + "px";
          DesignRuntime.getState()[v].state.style = {
            ...DesignRuntime.getState()[v].state.style,
            top,
            left,
            position: "absolute",
          };
          // re-wire element to root
          const parent = DesignRuntime.getState()[v].state.parent;
          if (parent !== "root") {
            DesignRuntime.getState()[v].state.parent = "root";
            DesignRuntime.getState()[parent].bus.next({ removechild: v });
            DesignRuntime.getCanvasRoot().bus.next({ acceptchild: v });
          }
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
          event.preventDefault();
          event.stopPropagation();
          const ID = DraggedElement.value;
          if (
            DesignRuntime.getState()[ID].ref.current &&
            DesignRuntime.getCanvasRoot().ref.current
          ) {
            const canvasRect = getCoords(
              DesignRuntime.getCanvasRoot().ref.current!
            );
            const elementRect = getCoords(
              DesignRuntime.getState()[ID].ref.current!
            );
            const top =
              (elementRect.top - canvasRect.top + event.movementY) /
                CanvasScale.value +
              "px";
            const left =
              (elementRect.left - canvasRect.left + event.movementX) /
                CanvasScale.value +
              "px";
            DesignRuntime.getState()[ID].state.style = {
              ...DesignRuntime.getState()[ID].state.style,
              top,
              left,
            };
            DesignRuntime.getState()[ID].bus.next({
              state: DesignRuntime.getState()[ID].state,
            });
          }
        }
      };
      const onmouseup = (event: MouseEvent) => {
        if (DraggedElement.value) {
          const ID = DraggedElement.value;
          const parent = selectParent(event, ID);
          if (parent !== "root") {
            // re-wire to parent
            const parentRect = getCoords(
              DesignRuntime.getState()[parent].ref.current!
            );

            const elementRect = getCoords(
              DesignRuntime.getState()[ID].ref.current!
            );
            const top =
              (elementRect.top - parentRect.top) / CanvasScale.value + "px";
            const left =
              (elementRect.left - parentRect.left) / CanvasScale.value + "px";
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
