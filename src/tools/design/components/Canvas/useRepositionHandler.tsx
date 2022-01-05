import React, { useEffect } from "react";
import getCoords from "../../lib/getCoords";
import { selectElement } from "../../lib/selectElement";
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
            DesignRuntime.getRefFor(v).current?.getBoundingClientRect()!;
          const top =
            (elementRect.top - canvasRootRect.top) / CanvasScale.value + "px";
          const left =
            (elementRect.left - canvasRootRect.left) / CanvasScale.value + "px";
          DesignRuntime.patchStyle(v, { top, left, position: "absolute" });
          // re-wire element to root
          DesignRuntime.patchState(v, { parent: "root" });
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
            DesignRuntime.getRefFor(ID).current &&
            DesignRuntime.getCanvasRoot().ref.current
          ) {
            const canvasRect = getCoords(
              DesignRuntime.getCanvasRoot().ref.current!
            );
            const elementRect = getCoords(DesignRuntime.getRefFor(ID).current!);
            const top =
              (elementRect.top - canvasRect.top + event.movementY) /
                CanvasScale.value +
              "px";
            const left =
              (elementRect.left - canvasRect.left + event.movementX) /
                CanvasScale.value +
              "px";
            DesignRuntime.patchStyle(ID, { top, left });
          }
        }
      };
      const onmouseup = (event: MouseEvent) => {
        if (DraggedElement.value) {
          const ID = DraggedElement.value;
          const parent = selectParent(event, ID);
          const parentRect = getCoords(
            parent !== "root"
              ? DesignRuntime.getRefFor(parent).current!
              : DesignRuntime.getCanvasRoot().ref.current!
          );

          const elementRect = getCoords(DesignRuntime.getRefFor(ID).current!);
          const top =
            (elementRect.top - parentRect.top) / CanvasScale.value + "px";
          const left =
            (elementRect.left - parentRect.left) / CanvasScale.value + "px";
          DesignRuntime.patchStyle(
            ID,
            { top, left, position: "absolute" },
            true
          );
          DesignRuntime.patchState(ID, { parent: parent } as any, true);
          DraggedElement.next(null);
          selectElement(ID);
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
