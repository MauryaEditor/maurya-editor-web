import { CanvasBox } from "./components/CanvasBox";
import { ComponentBox } from "./components/ComponentBox";
import { PropertiesBox } from "./components/PropertiesBox";

export const DesignContainer: React.FC = (props) => {
	return (
		<div style={{ display: "flex", height: "100%" }}>
			<div style={{ width: "14em", overflow: "hidden" }}>
				<ComponentBox />
			</div>
			<div style={{ flex: 1, overflow: "hidden" }}>
				<CanvasBox />
			</div>
			<div style={{ width: "14em", overflow: "hidden" }}>
				<PropertiesBox />
			</div>
		</div>
	);
};
