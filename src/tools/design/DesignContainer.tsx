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
			const mouseOverListener = (ev: MouseEvent) => {
				if (!DesignComponentSelected.value) {
					setCompCursor("grab");
				}
			};
			compContainer.current.addEventListener(
				"mouseover",
				mouseOverListener
			);
			// design component selected -> cursor = grabbing
			const subscription = DesignComponentSelected.subscribe({
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
			const mouseLeaveOrUpListener = () => {
				DesignComponentSelected.next(null);
				setCursor("default");
			};
			combinedContainer.current.addEventListener(
				"mouseleave",
				mouseOverListener
			);
			combinedContainer.current.addEventListener(
				"mouseup",
				mouseLeaveOrUpListener
			);
			return () => {
				compContainer.current?.removeEventListener(
					"mouseover",
					mouseOverListener
				);
				subscription.unsubscribe();
				combinedContainer.current?.removeEventListener(
					"mouseleave",
					mouseOverListener
				);
				combinedContainer.current?.removeEventListener(
					"mouseup",
					mouseLeaveOrUpListener
				);
			};
		}
	}, []);

	// on-drag component management
	const [SampleComp, setSampleComp] = useState<ComponentItem | null>(null);
	const [sampleTop, setSampleTop] = useState<string>("");
	const [sampleLeft, setSampleLeft] = useState<string>("");
	useEffect(() => {
		// design component selected -> set on-drag component
		const subscription = DesignComponentSelected.subscribe({
			next: (v) => {
				if (v) {
					setSampleComp(v);
				}
				if (!v) {
					setSampleComp(null);
				}
			},
		});
		return () => {
			subscription.unsubscribe();
		};
	}, []);
	useEffect(() => {
		if (combinedContainer.current) {
			const mouseMoveListener = (ev: MouseEvent) => {
				// container top and left
				const { top, left } = getCoords(combinedContainer.current!);
				setSampleTop(`${ev.clientY - top + 10}px`);
				setSampleLeft(`${ev.clientX - left + 10}px`);
			};
			combinedContainer.current.addEventListener(
				"mousemove",
				mouseMoveListener
			);
			return () => {
				combinedContainer.current?.removeEventListener(
					"mousemove",
					mouseMoveListener
				);
			};
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
