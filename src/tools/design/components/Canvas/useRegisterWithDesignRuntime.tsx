import React, { useEffect, useState } from "react";
import { BehaviorSubjectWrapper } from "../../../../runtime/BehaviorSubjectWrapper";
import { ReplaySubjectWrapper } from "../../../../runtime/ReplaySubjectWrapper";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";
import { ElementState } from "../../types/ElementState";

export const useRegisterWithDesignRuntime = (
  rootRef: React.RefObject<HTMLDivElement>
) => {
  const [bus, setBus] = useState<
    BehaviorSubjectWrapper<{ acceptchild?: string }>
  >(new BehaviorSubjectWrapper<{ acceptchild?: string }>({}));
  useEffect(() => {
    DesignRuntime.setCanvasRoot(rootRef, bus);
  }, [rootRef, bus]);
  return bus;
};
