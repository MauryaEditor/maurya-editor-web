import React, { useEffect, useState } from "react";
import { HeaderHeight } from "../../../rxjs/styles";

export const Header: React.FC = (props) => {
	const [height, setHeight] = useState<string>("");
	useEffect(() => {
		HeaderHeight.subscribe({
			next: (v) => {
				setHeight(v);
			},
		});
	}, [setHeight]);
	return (
		<div
			style={{
				width: "100%",
				height: height,
				boxSizing: "border-box",
				background: "#C4C4C4",
				borderBottom: "1px solid black",
			}}
		></div>
	);
};
