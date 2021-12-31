import { useEffect } from "react";
import { DesignRuntime } from "../runtime/DesignRuntime/DesignRuntime";

export const AdjustChildPositionOnDrop: React.FC<{ ID: string }> = (props) => {
  useEffect(() => {
    const subscription = DesignRuntime.getBusFor(props.ID).subscribe({
      next: (v) => {
        if (v && v["acceptchild"]) {
          if (
            DesignRuntime.getStateFor(props.ID).state &&
            DesignRuntime.getRefFor(props.ID) &&
            DesignRuntime.getRefFor(props.ID).current
          ) {
            const currTop = parseFloat(
              DesignRuntime.getStateFor(v["acceptchild"]).state.style
                .top as string
            );
            const currLeft = parseFloat(
              DesignRuntime.getStateFor(v["acceptchild"]).state.style
                .left as string
            );
            const topBorderWidth = parseFloat(
              window.getComputedStyle(
                DesignRuntime.getRefFor(props.ID).current!
              ).borderTopWidth
            );
            const leftBorderWidth = parseFloat(
              window.getComputedStyle(
                DesignRuntime.getRefFor(props.ID).current!
              ).borderLeftWidth
            );
            if (currTop && currLeft) {
              const newPosition = {
                top: currTop - topBorderWidth + "px",
                left: `${currLeft - leftBorderWidth}px`,
              };
              DesignRuntime.patchStyle(v["acceptchild"], newPosition);
              DesignRuntime.getBusFor(v["acceptchild"]).next({
                state: DesignRuntime.getStateFor(v["acceptchild"]).state,
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
