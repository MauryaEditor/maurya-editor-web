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
import { ActiveMenu, MenuConfig, MenuItem } from "../../../rxjs/EditorConfig";
import { HeaderHeight, MenuWidth } from "../../../rxjs/styles";

export const Menu: React.FC = (props) => {
  const [headerHeight, setHeaderHeight] = useState<string>("");
  const [menuWidth, setMenuWidth] = useState<string>("");
  const [menu, setMenu] = useState<{ [key: string]: MenuItem }>({});
  const [activeMenu, setActiveMenu] = useState<string>();
  useEffect(() => {
    HeaderHeight.subscribe({
      next: (v) => {
        setHeaderHeight(v);
      },
    });
    MenuWidth.subscribe({
      next: (v) => {
        setMenuWidth(v);
      },
    });
  }, [setHeaderHeight]);
  useEffect(() => {
    MenuConfig.subscribe({
      next: (v) => {
        setMenu(v);
      },
    });
  }, [setMenu]);
  useEffect(() => {
    ActiveMenu.subscribe({
      next: (v) => {
        if (v) {
          setActiveMenu(v);
          MenuConfig.value[v].onclick();
        }
      },
    });
  }, [setActiveMenu]);
  return (
    <div
      style={{
        height: `calc(100% - ${headerHeight})`,
        width: `${menuWidth}`,
        boxSizing: "border-box",
        background: "#EFF6FF",
        borderRight: "1px solid #BFDBFE",
        cursor: "pointer",
      }}
    >
      {Object.keys(menu).map((key) => {
        const commonStyle: React.CSSProperties = {
          textAlign: "left",
          width: "100%",
          paddingTop: "2em",
          paddingLeft: "0.8em",
          fontSize: "0.8em",
          boxSizing: "border-box",
          color: activeMenu === key ? "#1E40AF" : "#94A3B8",
          fontWeight: "bolder",
        };
        if (key === activeMenu) {
          return (
            <div
              style={{
                ...commonStyle,
              }}
              onClick={() => {
                ActiveMenu.next(key);
              }}
              key={key}
            >
              {menu[key].name}
            </div>
          );
        }
        return (
          <div
            style={{ ...commonStyle }}
            onClick={() => {
              ActiveMenu.next(key);
            }}
            key={key}
          >
            {menu[key].name}
          </div>
        );
      })}
    </div>
  );
};
