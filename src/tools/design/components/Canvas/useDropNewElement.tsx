import React, { useEffect } from "react";
import { PostCreateEvent } from "../../../../runtime/commands";
import getCoords from "../../lib/getCoords";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { SelectedDesignElement } from "../../runtime/interaction-states/SelectedDesignElement";

const isInsideRect = (element: HTMLElement, event: MouseEvent) => {
  const domRect = element.getBoundingClientRect();
  if (
    event.clientX >= domRect.left &&
    event.clientX <= domRect.right &&
    event.clientY >= domRect.top &&
    event.clientY <= domRect.bottom
  ) {
    return true;
  }
  return false;
};

const selectParent = (event: MouseEvent) => {
  const parent = DesignRuntime.getChildAcceptors().find((ID) => {
    if (
      DesignRuntime.getState()[ID].ref &&
      DesignRuntime.getState()[ID].ref.current
    ) {
      return isInsideRect(DesignRuntime.getState()[ID].ref.current!, event);
    } else {
      throw new Error("child acceptors should have ref");
    }
  });
  return parent;
};

export const useDropNewElement = (
  subcontainerRef: React.RefObject<HTMLElement>,
  rootRef: React.RefObject<HTMLElement>
) => {
  useEffect(() => {
    if (subcontainerRef.current) {
      const onmouseup = (event: MouseEvent) => {
        const subcontainer = subcontainerRef.current;
        if (SelectedDesignElement.value) {
          const parent = selectParent(event) || "root";
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
                top: `${event.clientY - top + 10}px`,
                left: `${event.clientX - left + 10}px`,
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
