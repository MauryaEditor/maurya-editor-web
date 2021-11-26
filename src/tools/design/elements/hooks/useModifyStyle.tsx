import React, { SetStateAction, useEffect } from "react";

export const useModifyStyle = (
  setStyle:
    | React.CSSProperties
    | React.Dispatch<React.SetStateAction<React.CSSProperties>>,
  cb: (currentStyle: React.CSSProperties) => React.CSSProperties
) => {
  useEffect(() => {
    if (typeof setStyle === "function") {
      setStyle((oldStyle) => {
        return cb(oldStyle);
      });
    }
  }, [setStyle]);
};
