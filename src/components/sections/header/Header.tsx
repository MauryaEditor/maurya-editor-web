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
        background: "#C4C4C4",
        borderBottom: "1px solid black",
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
            height: "2em",
          }}
          src={FeatherImage}
        />
        <img
          style={{
            position: "absolute",
            left: "50px",
            top: "50%",
            height: "1.5em",
            transform: "translate(0, -50%)",
          }}
          src={MauryaImage}
        />
      </div>
      <div
        style={{
          position: "absolute",
          marginTop: "0.5em",
          left: "50%",
          transform: "translate(-50%, 0)",
        }}
      >
        app / page
      </div>
      <div
        style={{
          display: "inline-flex",
          position: "absolute",
          right: 0,
          marginRight: "1em",
        }}
      >
        <div style={{ marginLeft: "1em", marginTop: "0.5em" }}>Share</div>
        <div style={{ marginLeft: "1em", marginTop: "0.5em" }}>Preview</div>
        <div style={{ marginLeft: "1em", marginTop: "0.5em" }}>Deploy</div>
        <div style={{ marginLeft: "1em", marginTop: "0.5em" }}>Account</div>
      </div>
    </div>
  );
};
