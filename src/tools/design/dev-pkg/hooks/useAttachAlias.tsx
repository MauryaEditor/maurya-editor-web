import { useEffect } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";

export const useAttachAlias = (ID: string) => {
  // TODO: get an auto-generated alias initially
  useEffect(() => {
    DesignRuntime.getStateFor(ID).isAliasable = true;
  }, []);
};
