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
import "./App.css";
import { Editor } from "./pages";
import "./rxjs/EditorConfig";
import "./runtime/Runtime";
import DesignConfig from "./tools/design/index";
import DevtoolConfig from "./tools/devtools/index";
import WorkflowConfig from "./tools/workflow/index";
import DataConfig from "./tools/data/index";
function App() {
  const [reloadCounter, setReloadCounter] = useState<number>(0);
  useEffect(() => {
    const reloadAppListener = () => {
      setReloadCounter((oldCounter) => {
        return oldCounter++;
      });
    };
    window.addEventListener("reloadmauryaapp", reloadAppListener);
    return () => {
      window.removeEventListener("reloadmauryaapp", reloadAppListener);
    };
  }, [setReloadCounter]);
  console.log("Rendering app with reload counter", reloadCounter);
  // code during development
  useEffect(() => {
    (window as any).ConfigBus.next(DesignConfig);
    (window as any).ConfigBus.next(WorkflowConfig);
    (window as any).ConfigBus.next(DataConfig);
  }, []);
  // DO NOT CHANGE CODE BELOW
  useEffect(() => {
    (window as any).ConfigBus.next(DevtoolConfig);
  }, []);
  return (
    <div className="App" style={{ height: "100vh", width: "100%" }}>
      <Editor />
    </div>
  );
}

export default App;
