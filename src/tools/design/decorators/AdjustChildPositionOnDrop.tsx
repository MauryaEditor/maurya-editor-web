import { useEffect } from "react";
import { DesignRuntime } from "../runtime/DesignRuntime/DesignRuntime";

export const AdjustChildPositionOnDrop: React.FC<{ ID: string }> = (props) => {
  useEffect(() => {
    const subscription = DesignRuntime.getState()[props.ID].bus.subscribe({
      next: (v) => {
        if (v && v["acceptchild"]) {
          if (
            DesignRuntime.getState()[props.ID].state &&
            DesignRuntime.getState()[props.ID].ref &&
            DesignRuntime.getState()[props.ID].ref.current
          ) {
            const currTop = parseFloat(
              DesignRuntime.getState()[v["acceptchild"]].state.style
                .top as string
            );
            const currLeft = parseFloat(
              DesignRuntime.getState()[v["acceptchild"]].state.style
                .left as string
            );
            const topBorderWidth = parseFloat(
              window.getComputedStyle(
                DesignRuntime.getState()[props.ID].ref.current!
              ).borderTopWidth
            );
            const leftBorderWidth = parseFloat(
              window.getComputedStyle(
                DesignRuntime.getState()[props.ID].ref.current!
              ).borderLeftWidth
            );
            if (currTop && currLeft) {
              DesignRuntime.getState()[v["acceptchild"]].state.style = {
                ...DesignRuntime.getState()[v["acceptchild"]].state.style,
                top: currTop - topBorderWidth + "px",
                left: `${currLeft - leftBorderWidth}px`,
              };
              DesignRuntime.getState()[v["acceptchild"]].bus.next({
                state: DesignRuntime.getState()[v["acceptchild"]].state,
              });
            }
          }
        }
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [props.ID]);
  return <>{props.children}</>;
};
