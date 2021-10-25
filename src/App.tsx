import React, { useEffect } from "react";
import "./App.css";
import { Editor } from "./pages";
import "./rxjs/EditorConfig";
import "./runtime/Runtime";
import DesignConfig from "./tools/design/index";
import DevtoolConfig from "./tools/devtools/index";
import WorkflowConfig from "./tools/workflow/index";
import DataConfig from "./tools/data/index";
function App() {
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
