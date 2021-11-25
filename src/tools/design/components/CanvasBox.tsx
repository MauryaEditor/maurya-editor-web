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
import React, { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { ComponentItem, ComponentRegistry } from "../rxjs/ComponentRegistry";
import {
  DesignComponentSelected,
  DrawRuntimeBus,
  DrawRuntimeState,
  InitDrawRuntimeState,
} from "../rxjs/DrawState";
import { SliceableReplaySubject } from "../rxjs/SliceableReplaySubject";
import { ElementDecorator } from "../decorators/ElementDecorator";
import getCoords from "../utils/getCoords";
const BaseWidth = 1440;
const BaseHeight = 900;

declare interface WebCreateData {
  compKey: string;
  pkg: string;
  ID: string;
  state?: { [key: string | number]: any };
}

declare interface WebPatchData {
  ID: string;
  slice: { [key: string | number]: any };
}

declare interface WebBusEvent {
  type: "CREATE" | "UPDATE" | "PATCH" | "DELETE"; // types of event
  payload: WebCreateData | WebPatchData; // payload
}

declare const SubscribeWebBus: (
  next: (v: WebBusEvent | null) => void
) => Subscription;

declare const PostCreateEvent: (payload: Omit<WebCreateData, "ID">) => string;

export const CanvasBox: React.FC = (props) => {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  // canvas size resizeable
  const [canvasHeight, setCanvasHeight] = useState<string>("");
  const [canvasWidth, setCanvasWidth] = useState<string>("");
  useEffect(() => {
    // TODO: check if screen height is greater than screen width
    const resize = () => {
      if (box.current && canvas.current) {
        const width = box.current.getBoundingClientRect().width;
        let factor = 1;
        if (width > BaseWidth) {
          factor = Math.floor(width / BaseWidth);
          setCanvasWidth(`${BaseWidth * factor}px`);
          setCanvasHeight(`${BaseHeight * factor}px`);
        } else {
          factor = Math.ceil((BaseWidth / width) * 10) / 10;
          setCanvasWidth(`${BaseWidth / factor}px`);
          setCanvasHeight(`${BaseHeight / factor}px`);
        }
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [box, canvas]);

  // post events: create and patch
  useEffect(() => {
    if (canvas.current && root.current) {
      const mouseUpListener = (ev: MouseEvent) => {
        if (DesignComponentSelected.value) {
          // Simplification-1: Send style in PostCreateEvent
          const { top, left } = getCoords(root.current!);
          PostCreateEvent({
            compKey: DesignComponentSelected.value.key,
            pkg: "design",
            state: {
              style: {
                position: "absolute",
                top: `${ev.clientY - top + 10}px`,
                left: `${ev.clientX - left + 10}px`,
              },
            },
          });
          // Simplification-2: Remove Patch Event
        }
      };
      canvas.current.addEventListener("mouseup", mouseUpListener);
    }
  }, [canvas, root]);

  // add component
  const [renderedComps, setRenderedComps] = useState<
    [React.FC, object, string, React.FC<any>][]
  >([]);
  const DefualtDecoratorElement = ElementDecorator;
  useEffect(() => {
    const subscription = SubscribeWebBus((v: WebBusEvent | null) => {
      if (v) {
        if (v.type === "CREATE") {
          let compItem: ComponentItem;
          const webCreateData = v.payload as WebCreateData;
          for (let i = 0; i < ComponentRegistry.value.length; i++) {
            const compItems = ComponentRegistry.value[i][1];
            for (let j = 0; j < compItems.length; j++) {
              if (compItems[j].key === webCreateData.compKey) {
                compItem = compItems[j];
                break;
              }
            }
          }
          // Simplification-3: Props must take ID and extend style with position, top, left
          const renderProps = compItem!.renderCompProps!();
          const bus = new SliceableReplaySubject<any>();
          const props = {
            renderProps: renderProps,
            ...webCreateData.state,
            ID: webCreateData.ID,
          };
          DrawRuntimeBus.next({
            ID: webCreateData.ID,
            payload: InitDrawRuntimeState({
              bus: bus,
              compKey: webCreateData.compKey,
              ...props,
            }),
          });
          if (compItem!) {
            setRenderedComps((val) => [
              ...val,
              [
                compItem.renderComp,
                { ...props },
                v.payload.ID,
                compItem.decorator
                  ? compItem.decorator
                  : DefualtDecoratorElement,
              ],
            ]);
          }
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setRenderedComps]);

  useEffect(() => {
    const subscription = SubscribeWebBus((v: WebBusEvent | null) => {
      if (v && v.type === "PATCH") {
        const webPatchData = v.payload as WebPatchData;
        DrawRuntimeState[v.payload.ID].bus.next(webPatchData.slice);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        background: "#E5E5E5",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
      ref={box}
    >
      <div
        ref={canvas}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          background: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "hidden",
          boxSizing: "border-box",
          border: "1px solid #BFDBFE",
        }}
      >
        <div
          id="canvasRoot"
          style={{
            overflow: "auto",
            width: canvasWidth,
            height: "auto",
            scrollbarWidth: "thin",
            boxSizing: "border-box",
          }}
          ref={root}
        >
          {renderedComps.map(([Comp, props, key, Decorator]) => {
            return (
              <Decorator ID={key} key={key}>
                <Comp {...props} key={key} data-id={key} />
              </Decorator>
            );
          })}
        </div>
      </div>
    </div>
  );
};
