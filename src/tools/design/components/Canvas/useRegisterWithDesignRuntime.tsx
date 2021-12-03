import React, { useEffect } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";

export const useRegisterWithDesignRuntime = (
  rootRef: React.RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    DesignRuntime.setCanvasRoot(rootRef);
  }, [rootRef]);
};
