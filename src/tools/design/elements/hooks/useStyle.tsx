import React, { useEffect, useState } from "react";
import { DrawRuntimeBus, DrawRuntimeState } from "../../rxjs/DrawState";
import { useBus } from "./useBus";

export const useStyle = (ID: string, initialStyle: React.CSSProperties) => {
	const [style, setStyle] = useState<React.CSSProperties>(initialStyle);
	const bus = useBus(ID);
	// attach style
	useEffect(() => {
		DrawRuntimeBus.next({
			ID: ID,
			payload: {
				style: {
					...style,
				},
			},
		});
	}, [style]);

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

	return [style, setStyle];
};
