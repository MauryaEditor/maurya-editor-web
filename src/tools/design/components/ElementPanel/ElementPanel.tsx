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
import React from "react";
import { SelectedDesignElement } from "../../runtime/interaction-states/SelectedDesignElement";
import "./ElementPanel.css";
import { useDragElement } from "./useDragElement";
import { useListCategories } from "./useListCategories";

export const ELementPanel: React.FC = React.memo((props) => {
  const categories = useListCategories();
  const cursor = useDragElement();
  return (
    <div className={"panel"} style={{ cursor }}>
      {categories.map((category) => {
        const elements = category.elements;
        const categoryName = category.category;
        return (
          <div key={categoryName}>
            <div className={"category"}>{category.category}</div>
            {elements.map((element) => {
              const Comp = element.comp;
              return (
                <div
                  className={"element"}
                  key={element.key}
                  onMouseDown={() => {
                    SelectedDesignElement.next(element);
                  }}
                  style={{ cursor: cursor === "default" ? "grab" : cursor }}
                >
                  <Comp {...element.props} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});
