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
import { ComponentList, ComponentRegistry } from "../rxjs/ComponentRegistry";
import { DesignComponentSelected } from "../rxjs/DrawState";

export const ComponentBox: React.FC = (props) => {
  const [componentLists, setComponentLists] = useState<ComponentList>([]);
  useEffect(() => {
    const subscription = ComponentRegistry.subscribe({
      next: (v) => {
        setComponentLists(v);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setComponentLists]);
  return (
    <div
      style={{
        borderRight: "1px solid #BFDBFE",
        height: "100%",
        background: "#EFF6FF",
      }}
    >
      {componentLists.map((componentList, index) => {
        const category = componentList[0];
        const list = componentList[1];
        return (
          <div key={category}>
            <div
              style={{
                paddingTop: index === 0 ? "2rem" : "1.2rem",
                paddingBottom: "0.4rem",
                paddingLeft: "1.2rem",
                fontSize: "0.8rem",
                color: "#94A3B8",
                fontWeight: "bolder",
              }}
            >
              {category}
            </div>
            {list.map((item) => {
              const Comp = item.comp;
              return (
                <div
                  key={item.key}
                  onMouseDown={() => {
                    DesignComponentSelected.next(item);
                  }}
                >
                  <Comp {...item.props} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
