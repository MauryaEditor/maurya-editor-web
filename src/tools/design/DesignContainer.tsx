import React, { useEffect, useRef, useState } from "react";
import { CanvasBox } from "./components/CanvasBox";
import { ComponentBox } from "./components/ComponentBox";
import { PropertiesBox } from "./components/PropertiesBox";
import { ComponentItem } from "./rxjs/ComponentRegistry";
import { DesignComponentSelected } from "./rxjs/DrawState";
import getCoords from "./utils/getCoords";

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
					if (!v) {
						setCursor("default");
						setCompCursor("grab");
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

	// on-drag component management
	const [SampleComp, setSampleComp] = useState<ComponentItem | null>(null);
	const [sampleTop, setSampleTop] = useState<string>("");
	const [sampleLeft, setSampleLeft] = useState<string>("");
	useEffect(() => {
		// design component selected -> set on-drag component
		DesignComponentSelected.subscribe({
			next: (v) => {
				if (v) {
					setSampleComp(v);
				}
				if (!v) {
					setSampleComp(null);
				}
			},
		});
	}, []);
	useEffect(() => {
		if (combinedContainer.current) {
			combinedContainer.current.addEventListener("mousemove", (ev) => {
				// container top and left
				const { top, left } = getCoords(combinedContainer.current!);
				setSampleTop(`${ev.clientY - top + 10}px`);
				setSampleLeft(`${ev.clientX - left + 10}px`);
			});
		}
	}, [combinedContainer]);
	return (
		<div style={{ display: "flex", height: "100%", userSelect: "none" }}>
			<div
				style={{
					flex: 1,
					display: "flex",
					cursor: cursor,
					position: "relative",
				}}
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
				{SampleComp ? (
					<div
						style={{
							position: "absolute",
							top: sampleTop,
							left: sampleLeft,
						}}
					>
						{<SampleComp.ondragComp {...SampleComp.ondragProps} />}
					</div>
				) : null}
			</div>
			<div style={{ width: "14em", overflow: "hidden" }}>
				<PropertiesBox />
			</div>
		</div>
	);
};
