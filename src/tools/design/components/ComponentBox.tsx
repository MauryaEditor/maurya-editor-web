import React, { useEffect, useRef, useState } from "react";
import { ComponentList, ComponentRegistry } from "../rxjs/ComponentRegistry";
import { DesignComponentSelected } from "../rxjs/DrawState";

export const ComponentBox: React.FC = (props) => {
	const [componentLists, setComponentLists] = useState<ComponentList>([]);
	useEffect(() => {
		ComponentRegistry.subscribe({
			next: (v) => {
				setComponentLists(v);
			},
		});
	}, [setComponentLists]);
	return (
		<div style={{ borderRight: "1px solid black", height: "100%" }}>
			{componentLists.map((componentList) => {
				const category = componentList[0];
				const list = componentList[1];
				return (
					<div key={category}>
						<div
							style={{
								position: "relative",
								height: "2em",
								borderBottom: "1px solid black",
							}}
						>
							<span
								style={{
									position: "absolute",
									top: "50%",
									left: "0.5em",
									transform: "translate(0, -50%)",
									fontWeight: "bold",
								}}
							>
								{category}
							</span>

							<span
								style={{
									position: "absolute",
									top: "50%",
									right: "0.5em",
									transform: "translate(0, -50%)",
								}}
							>
								Arrow
							</span>
						</div>
						{list.map((item) => {
							const Comp = item.comp;
							return (
								<div
									key={item.key}
									onMouseDown={() => {
										console.log("moo");
										DesignComponentSelected.next(Comp);
									}}
								>
									<Comp {...item.props} />
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
