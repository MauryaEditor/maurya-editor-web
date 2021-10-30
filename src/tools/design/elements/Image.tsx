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
import { RenderProps } from "./types/RenderProps";
import { SimpleComponent } from "./utils/SimpleComponent";
import { SimpleDragComponent } from "./utils/SimpleDragComponent";
import { useBus } from "./hooks/useBus";
import AddImage from "./assets/add-image.png";
const RenderComp: React.FC<RenderProps> = (props) => {
	const [style, setStyle] = useState(props.style!);
	const bus = useBus(props.ID);

	// render component again if props changes
	// can be used from places where acces to component is available
	useEffect(() => {
		setStyle(props.style!);
	}, [props.style, setStyle]);

	// listen to patch events
	useEffect(() => {
		if (bus)
			bus.subscribe({
				next: (v) => {
					if (v.style) {
						setStyle((old: React.CSSProperties | undefined) => {
							return { ...old!, ...v.style };
						});
					}
				},
			});
	}, [setStyle, bus]);
	return <img style={{ ...style }} alt={""} src={AddImage} width="100px" />;
};

const manifest = {
	key: "Image",
	comp: SimpleComponent,
	props: { name: "Image" },
	ondragComp: SimpleDragComponent,
	ondragProps: { name: "Image" },
	renderComp: RenderComp,
	renderCompProps: () => {
		return {
			style: { width: "2em" } as React.CSSProperties,
		};
	},
};

export default manifest;
