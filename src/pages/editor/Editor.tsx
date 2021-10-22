import React, { useEffect, useState } from "react";
import { Header } from "../../components/sections/header";
import { Menu } from "../../components/sections/menu";
import { SubContainerComponent } from "../../components/sections/subcontainer/SubContainerComponent";
import { ActiveMenu, MenuConfig } from "../../rxjs/EditorConfig";
import { WindowContainerStack } from "../../rxjs/styles";

export const Editor: React.FC = (props) => {
	const [windowContainers, setWindowContainers] = useState<React.FC[]>([]);
	useEffect(() => {
		WindowContainerStack.subscribe({
			next: (v) => {
				if (v.length === 0) {
					setWindowContainers([Header, Menu, SubContainerComponent]);
				} else {
					setWindowContainers(v);
				}
			},
		});
	}, [setWindowContainers]);

	useEffect(() => {
		MenuConfig.subscribe({
			next: (v) => {
				if (!ActiveMenu.value && v && Object.keys(v).length > 0) {
					ActiveMenu.next(Object.keys(v)[0]);
				}
			},
		});
	}, []);
	return (
		<div style={{ width: "100%", height: "100%" }}>
			{windowContainers.map((Container) => {
				return <Container key={Container.name} />;
			})}
		</div>
	);
};
