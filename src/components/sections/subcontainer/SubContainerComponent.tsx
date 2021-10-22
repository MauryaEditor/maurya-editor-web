import React, { useEffect, useState } from "react";
import {
	HeaderHeight,
	MenuWidth,
	SubContainerStack,
} from "../../../rxjs/styles";

export const SubContainerComponent: React.FC = (props) => {
	const [menuWidth, setMenuWidth] = useState<string>("");
	const [headerHeight, setHeaderHeight] = useState<string>("");
	const [containers, setContainers] = useState<React.FC[]>([]);
	useEffect(() => {
		MenuWidth.subscribe({
			next: (v) => {
				setMenuWidth(v);
			},
		});
		HeaderHeight.subscribe({
			next: (v) => {
				setHeaderHeight(v);
			},
		});
	}, [setHeaderHeight, setMenuWidth]);
	useEffect(() => {
		SubContainerStack.subscribe({
			next: (v) => {
				setContainers(v);
			},
		});
	}, [setContainers]);
	return (
		<div
			style={{
				position: "absolute",
				top: headerHeight,
				left: menuWidth,
				width: `calc(100% - ${menuWidth})`,
				height: `calc(100% - ${headerHeight})`,
			}}
		>
			{containers.map((Container) => {
				return <Container key={Container.name} />;
			})}
		</div>
	);
};
