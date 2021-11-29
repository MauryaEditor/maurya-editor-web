/**
    Copyright 2021 Quaffles    
 
    This file is part of Maurya Editor.
    Maurya Editor is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
    Maurya Editor is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, { useEffect, useState } from "react";
import getCoords from "../../lib/getCoords";
import { SelectedDesignElement } from "../../runtime/interaction-states/SelectedDesignElement";
import { DesignElement } from "../../types/DesignElement";

export const useShowSampleElement = (
  combinedContainerRef: React.RefObject<HTMLElement>
) => {
  const [sampleElement, setSampleElement] = useState<DesignElement | null>(
    null
  );
  const [sampleTop, setSampleTop] = useState<string>("");
  const [sampleLeft, setSampleLeft] = useState<string>("");
  useEffect(() => {
    const subscription = SelectedDesignElement.subscribe({
      next: (v) => {
        if (v) {
          setSampleElement(v);
        } else {
          setSampleElement(null);
        }
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setSampleElement]);
  useEffect(() => {
    const onMouseMoveOrDown = (event: MouseEvent) => {
      const { top, left } = getCoords(combinedContainerRef.current!);
      setSampleTop(`${event.clientY - top + 10}px`);
      setSampleLeft(`${event.clientX - left + 10}px`);
    };
    combinedContainerRef.current?.addEventListener(
      "mousedown",
      onMouseMoveOrDown
    );
    combinedContainerRef.current?.addEventListener(
      "mousemove",
      onMouseMoveOrDown
    );
    return () => {
      combinedContainerRef.current?.removeEventListener(
        "mousedown",
        onMouseMoveOrDown
      );

      combinedContainerRef.current?.removeEventListener(
        "mousemove",
        onMouseMoveOrDown
      );
    };
  }, [combinedContainerRef, setSampleTop, setSampleLeft]);
  return { element: sampleElement, top: sampleTop, left: sampleLeft };
};
