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
import { DrawRuntimeBus, DrawRuntimeState } from "../../rxjs/DrawState";
import { useBus } from "./useBus";

export const useStyle = (ID: string, initialStyle: React.CSSProperties) => {
  const [style, setStyle] = useState<React.CSSProperties>(initialStyle);
  const bus = useBus(ID);
  // attach style
  useEffect(() => {
    DrawRuntimeBus.next({
      ID: ID,
      payload: {
        style: {
          ...style,
        },
      },
    });
  }, [style]);

  // listen to patch events
  useEffect(() => {
    if (bus) {
      const subscription = bus.subscribe({
        next: (v) => {
          if (v.style) {
            console.log("new style received", v.style);
            setStyle((old: React.CSSProperties | undefined) => {
              return { ...old!, ...v.style };
            });
          }
        },
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [setStyle, bus]);

  return [style, setStyle];
};
