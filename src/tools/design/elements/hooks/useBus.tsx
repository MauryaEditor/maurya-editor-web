import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { DrawRuntimeState } from "../../rxjs/DrawState";

export const useBus = (ID: string) => {
	const [bus, setBus] = useState<BehaviorSubject<any>>();
	useEffect(() => {
		if (DrawRuntimeState[ID].bus) {
			setBus(DrawRuntimeState[ID].bus);
		}
	}, [DrawRuntimeState[ID].bus, setBus]);
	return bus;
};
