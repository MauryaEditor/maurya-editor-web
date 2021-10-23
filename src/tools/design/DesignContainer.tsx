import { useEffect, useRef, useState } from "react";
import { CanvasBox } from "./components/CanvasBox";
import { ComponentBox } from "./components/ComponentBox";
import { PropertiesBox } from "./components/PropertiesBox";
import { DesignComponentSelected } from "./rxjs/DrawState";

export const DesignContainer: React.FC = (props) => {
	// cursor management
	const combinedContainer = useRef<HTMLDivElement>(null);
	const [cursor, setCursor] = useState<string>("");
	const compContainer = useRef<HTMLDivElement>(null);
	const [compCursor, setCompCursor] = useState<string>("");
	useEffect(() => {
		if (compContainer.current && combinedContainer.current) {
			// mouse over component box and no component selected -> cursor = grab
			compContainer.current.addEventListener(
				"mouseover",
				(ev: MouseEvent) => {
					if (!DesignComponentSelected.value) {
						setCompCursor("grab");
					}
				}
			);
			// design component selected -> cursor = grabbing
			DesignComponentSelected.subscribe({
				next: (v) => {
					if (v) {
						setCursor("grabbing");
						setCompCursor("grabbing");
					}
				},
			});
			// mouse leave, mouse up -> DesignComponent assigned nil; cursor = pointer
			combinedContainer.current.addEventListener("mouseleave", () => {
				DesignComponentSelected.next(null);
				setCursor("default");
			});
			combinedContainer.current.addEventListener("mouseup", () => {
				DesignComponentSelected.next(null);
				setCursor("default");
			});
		}
	}, []);

	return (
		<div style={{ display: "flex", height: "100%", userSelect: "none" }}>
			<div
				style={{ flex: 1, display: "flex", cursor: cursor }}
				ref={combinedContainer}
			>
				<div
					style={{
						width: "14em",
						overflow: "hidden",
						cursor: compCursor,
					}}
					ref={compContainer}
				>
					<ComponentBox />
				</div>
				<div style={{ flex: 1, overflow: "hidden" }}>
					<CanvasBox />
				</div>
			</div>
			<div style={{ width: "14em", overflow: "hidden" }}>
				<PropertiesBox />
			</div>
		</div>
	);
};
