import React, { useEffect } from "react";
import "./App.css";
import { Editor } from "./pages";
import "./rxjs/EditorConfig";
import "./runtime/Runtime";
import DesignConfig from "./tools/design/index";
import DevtoolConfig from "./tools/devtools/index";
function App() {
	// code during development
	useEffect(() => {
		(window as any).ConfigBus.next(DesignConfig);
	}, []);
	// DO NOT CHANGE CODE BELOW
	useEffect(() => {
		(window as any).ConfigBus.next(DevtoolConfig);
	});
	return (
		<div className="App" style={{ height: "100vh", width: "100%" }}>
			<Editor />
		</div>
	);
}

export default App;
