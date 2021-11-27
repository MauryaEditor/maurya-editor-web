import { useEffect } from "react";
import { DesignRuntime } from "../../runtime/DesignRuntime/DesignRuntime";

export const useAcceptChild = (ID: string) => {
  useEffect(() => {
    DesignRuntime.registerParent(ID);
    return () => {
      DesignRuntime.removeParent(ID);
    };
  }, [ID]);
};
