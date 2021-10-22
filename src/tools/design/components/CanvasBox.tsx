import { useEffect, useRef, useState } from "react";

const BaseWidth = 1440;
const BaseHeight = 900;

export const CanvasBox: React.FC = (props) => {
	const box = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLDivElement>(null);
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
					console.log(BaseWidth / width);
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
						overflow: "scroll",
						width: canvasWidth,
						height: canvasHeight,
						scrollbarWidth: "thin",
						boxSizing: "border-box",
					}}
				>
					<div style={{ height: "5000px", background: "blue" }}>
						<div>asd</div>
						<div>dasd</div>
					</div>
				</div>
			</div>
		</div>
	);
};
