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
import React, { useEffect, useRef } from "react";
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";
import AddImage from "./assets/add-image.svg";
import { useStyle } from "./hooks/useStyle";
import { useAttachAppearance } from "./hooks/useAttachAppearance";
import Chart from "chart.js/auto";
import { useAttachProperty } from "./hooks/useAttachProperty";
import { useDevAttributes } from "./hooks/useDevAttributes";

export const Multilinegraph: React.FC<RenderProps> = (props) => {
  const [style, setStyle] = useStyle(props.ID, props.style!);
  const devAttrs = useDevAttributes<HTMLImageElement>(props.ID);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const Alias = useAttachProperty<string>(
    props.ID,
    "design/alias",
    "Alias",
    props.properties?.Alias || ""
  );

  const Width = useAttachAppearance<string>(
    props.ID,
    "design/text",
    "Width",
    props.appearance?.Width || "256px"
  );

  const Height = useAttachAppearance<string>(
    props.ID,
    "design/text",
    "Height",
    props.appearance?.Height || "256px"
  );

  const X = useAttachProperty<string[]>(
    props.ID,
    "design/text",
    "X",
    props.properties?.X || []
  );

  const Y = useAttachProperty<number[]>(
    props.ID,
    "design/text",
    "Y",
    props.properties?.Y || []
  );

  const Labels = useAttachProperty<string>(
    props.ID,
    "design/text",
    "Labels",
    props.properties?.Labels || []
  );

  const colors = ["rgba(255, 0, 0, 0.5)", "rgba(0, 0, 255, 0.5)"];

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const datasets = [];
      for (let i = 0; i < Labels.length && i < X.length && i < Y.length; i++) {
        datasets.push({
          label: Labels[i],
          data: Y[i],
          fill: {
            target: i === 0 ? "origin" : i - 1,
            above: colors[i], // Area will be red above the origin
          },
          borderColor: colors[i],
          backgroundColor: colors[i],
          tension: 0.1,
        });
      }
      const data = {
        labels: X,
        datasets: datasets,
      };
      const chart = new Chart(ctx!, { type: "line", data: data });
    }
  }, [canvasRef, X, Y, Labels]);

  return (
    <>
      {X && Y && X.length && Y.length ? (
        <div
          style={{
            ...style,
            width: Width,
            height: Height,
          }}
        >
          <canvas ref={canvasRef} width={Width} height={Height} />
        </div>
      ) : (
        <img
          {...devAttrs}
          height={Height}
          style={{ ...style, objectFit: "cover" }}
          alt={""}
          src={AddImage}
          width={Width}
        />
      )}
    </>
  );
};

const manifest = {
  key: "Multilinegraph",
  comp: SimpleComponent,
  props: { name: "Multilinegraph" },
  ondragComp: SimpleDragComponent,
  ondragProps: { name: "Multilinegraph" },
  renderComp: Multilinegraph,
  renderCompProps: () => {
    return {
      style: { width: "2em" } as React.CSSProperties,
    };
  },
};

export default manifest;
