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
