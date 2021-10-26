import React, { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { ComponentItem, ComponentRegistry } from "../rxjs/ComponentRegistry";
import {
	DesignComponentSelected,
	DrawRuntimeBus,
	DrawRuntimeState,
} from "../rxjs/DrawState";
import getCoords from "../utils/getCoords";
const BaseWidth = 1440;
const BaseHeight = 900;

declare interface WebCreateData {
	compKey: string;
	pkg: string;
	tempID: string;
}

export interface WebPatchData {
	tempID: string;
	style: React.CSSProperties;
}

declare interface WebBusEvent {
	type: "CREATE" | "UPDATE" | "PATCH" | "DELETE"; // types of event
	payload: WebCreateData | WebPatchData; // payload
}

declare const SubscribeWebBus: (
	next: (v: WebBusEvent | null) => void
) => Subscription;

declare const PostCreateEvent: (
	payload: Omit<WebCreateData, "tempID">
) => string;

declare const PostPatchEvent: (payload: WebPatchData) => string;

export const CanvasBox: React.FC = (props) => {
	const box = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLDivElement>(null);
	const root = useRef<HTMLDivElement>(null);
	// canvas size resizeable
	const [canvasHeight, setCanvasHeight] = useState<string>("");
	const [canvasWidth, setCanvasWidth] = useState<string>("");
	useEffect(() => {
		// TODO: check if screen height is greater than screen width
		const resize = () => {
			if (box.current && canvas.current) {
				const width = box.current.getBoundingClientRect().width;
				let factor = 1;
				if (width > BaseWidth) {
					factor = Math.floor(width / BaseWidth);
					setCanvasWidth(`${BaseWidth * factor}px`);
					setCanvasHeight(`${BaseHeight * factor}px`);
				} else {
					factor = Math.ceil((BaseWidth / width) * 10) / 10;
					setCanvasWidth(`${BaseWidth / factor}px`);
					setCanvasHeight(`${BaseHeight / factor}px`);
				}
			}
		};
		resize();
		window.addEventListener("resize", resize);
		return () => {
			window.removeEventListener("resize", resize);
		};
	}, [box, canvas]);

	// post events: create and patch
	useEffect(() => {
		if (canvas.current && root.current) {
			canvas.current.addEventListener("mouseup", (ev) => {
				if (DesignComponentSelected.value) {
					const tempID = PostCreateEvent({
						compKey: DesignComponentSelected.value.key,
						pkg: "design",
					});
					const { top, left } = getCoords(root.current!);
					PostPatchEvent({
						tempID,
						style: {
							position: "absolute",
							top: `${ev.clientY - top + 10}px`,
							left: `${ev.clientX - left + 10}px`,
						},
					});
				}
			});
		}
	}, [canvas, root]);

	// add component
	const [renderedComps, setRenderedComps] = useState<
		[React.FC, object, string][]
	>([]);
	useEffect(() => {
		SubscribeWebBus((v: WebBusEvent | null) => {
			if (v) {
				if (v.type === "CREATE") {
					setRenderedComps((val) => {
						let compItem: ComponentItem;
						for (
							let i = 0;
							i < ComponentRegistry.value.length;
							i++
						) {
							const compItems = ComponentRegistry.value[i][1];
							for (let j = 0; j < compItems.length; j++) {
								if (
									compItems[j].key ===
									(v.payload as WebCreateData).compKey
								) {
									compItem = compItems[j];
								}
							}
						}
						const renderProps = compItem!.renderCompProps!();
						DrawRuntimeBus.next({
							ID: v.payload.tempID,
							payload: {
								bus: renderProps.bus,
							},
						});
						if (compItem!)
							return [
								...val,
								[
									compItem.renderComp,
									{ ...renderProps, ID: v.payload.tempID },
									v.payload.tempID,
								],
							];
						return [...val];
					});
				}
			}
		});
	}, [setRenderedComps]);

	useEffect(() => {
		SubscribeWebBus((v: WebBusEvent | null) => {
			if (v && v.type === "PATCH") {
				for (let i = 0; i < renderedComps.length; i++) {
					const tempID = renderedComps[i][2];
					if (tempID === v.payload.tempID)
						DrawRuntimeState[tempID].bus.next({
							style: (v.payload as WebPatchData).style,
						});
				}
			}
		});
	}, [renderedComps]);

	return (
		<div
			style={{
				background: "#C4C4C4",
				height: "100%",
				width: "100%",
				position: "relative",
			}}
			ref={box}
		>
			<div
				ref={canvas}
				style={{
					width: canvasWidth,
					height: canvasHeight,
					background: "white",
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					overflow: "hidden",
					boxSizing: "border-box",
				}}
			>
				<div
					id="canvasRoot"
					style={{
						overflow: "auto",
						width: canvasWidth,
						height: "auto",
						scrollbarWidth: "thin",
						boxSizing: "border-box",
					}}
					ref={root}
				>
					{renderedComps.map(([Comp, props, key]) => {
						return <Comp {...props} key={key} data-id={key} />;
					})}
				</div>
			</div>
		</div>
	);
};
