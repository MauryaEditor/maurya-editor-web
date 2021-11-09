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
import { Header } from "../../components/sections/header";
import { Menu } from "../../components/sections/menu";
import { SubContainerComponent } from "../../components/sections/subcontainer/SubContainerComponent";
import { ActiveMenu, MenuConfig } from "../../rxjs/EditorConfig";
import { WindowContainerStack } from "../../rxjs/styles";

export const Editor: React.FC = (props) => {
  const [windowContainers, setWindowContainers] = useState<React.FC[]>([]);
  useEffect(() => {
    WindowContainerStack.subscribe({
      next: (v) => {
        if (v.length === 0) {
          setWindowContainers([Header, Menu, SubContainerComponent]);
        } else {
          setWindowContainers(v);
        }
      },
    });
  }, [setWindowContainers]);

  useEffect(() => {
    MenuConfig.subscribe({
      next: (v) => {
        if (!ActiveMenu.value && v && Object.keys(v).length > 0) {
          ActiveMenu.next(Object.keys(v)[0]);
        }
      },
    });
  }, []);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {windowContainers.map((Container) => {
        return <Container key={Container.name} />;
      })}
    </div>
  );
};
