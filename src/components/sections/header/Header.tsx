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
import { HeaderHeight } from "../../../rxjs/styles";
import MauryaImage from "../../../assets/images/Maurya.png";
import FeatherImage from "../../../assets/images/Feather.png";
import { Options } from "./components/Options";
export const Header: React.FC = (props) => {
  const [height, setHeight] = useState<string>("");
  useEffect(() => {
    HeaderHeight.subscribe({
      next: (v) => {
        setHeight(v);
      },
    });
  }, [setHeight]);
  return (
    <div
      style={{
        width: "100%",
        height: height,
        boxSizing: "border-box",
        background: "#EFF6FF",
        borderBottom: "1px solid #BFDBFE",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "auto",
        }}
      >
        <img
          style={{
            position: "absolute",
            left: "1em",
            top: "50%",
            transform: "translate(0, -50%)",
            height: "1em",
          }}
          src={FeatherImage}
        />
        <img
          style={{
            position: "absolute",
            left: "35px",
            top: "50%",
            height: "0.8em",
            transform: "translate(0, -50%)",
          }}
          src={MauryaImage}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: 600,
          fontSize: "0.8rem",
        }}
      >
        <span style={{ color: "#94A3B8" }}>App / </span>Page
      </div>
      <div
        style={{
          display: "inline-flex",
          position: "absolute",
          right: 0,
          marginRight: "1em",
        }}
      ></div>
      <Options />
    </div>
  );
};
