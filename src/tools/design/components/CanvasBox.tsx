import React, { useEffect, useRef, useState } from "react";
import { BehaviorSubject, Subscription } from "rxjs";
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
	ID: string;
	state?: { [key: string | number]: any };
}

export interface WebPatchData {
	ID: string;
	slice: { [key: string | number]: any };
}

declare interface WebBusEvent {
	type: "CREATE" | "UPDATE" | "PATCH" | "DELETE"; // types of event
	payload: WebCreateData | WebPatchData; // payload
}

declare const SubscribeWebBus: (
	next: (v: WebBusEvent | null) => void
) => Subscription;

declare const PostCreateEvent: (payload: Omit<WebCreateData, "ID">) => string;

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
					// Simplification-1: Send style in PostCreateEvent
					const { top, left } = getCoords(root.current!);
					PostCreateEvent({
						compKey: DesignComponentSelected.value.key,
						pkg: "design",
						state: {
							style: {
								position: "absolute",
								top: `${ev.clientY - top + 10}px`,
								left: `${ev.clientX - left + 10}px`,
							},
						},
					});
					// Simplification-2: Remove Patch Event
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
						const webCreateData = v.payload as WebCreateData;
						for (
							let i = 0;
							i < ComponentRegistry.value.length;
							i++
						) {
							const compItems = ComponentRegistry.value[i][1];
							for (let j = 0; j < compItems.length; j++) {
								if (
									compItems[j].key === webCreateData.compKey
								) {
									compItem = compItems[j];
									break;
								}
							}
						}
						// Simplification-3: Props must take ID and extend style with position, top, left
						const renderProps = compItem!.renderCompProps!();
						const bus = new BehaviorSubject<any>({});
						const props = {
							renderProps: renderProps,
							...webCreateData.state,
							ID: webCreateData.ID,
						};
						DrawRuntimeBus.next({
							ID: webCreateData.ID,
							payload: { bus: bus, ...props },
						});
						if (compItem!)
							return [
								...val,
								[
									compItem.renderComp,
									{ ...props },
									v.payload.ID,
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
				const webPatchData = v.payload as WebPatchData;
				// Simplification-4 Maintain a map of tempID and renderedComps
				// Why not put rendered component in DataRuntimeState?
				// Because we don't know if the component gets destroyed
				for (let i = 0; i < renderedComps.length; i++) {
					const tempID = renderedComps[i][2];
					if (tempID === webPatchData.ID)
						// Simplification-5 Bus can take any key value pair
						// but some keys are reserved - style, properties and appearnce
						// Why? - For PropertyBox to work properly
						DrawRuntimeState[tempID].bus.next(webPatchData.slice);
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
