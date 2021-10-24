import {
	WebBus,
	WebBusEvent,
	WebCreateData,
	WebPatchData,
} from "../rxjs/EditorConfig";

export const RuntimeState: {
	tempIDIssued: any;
	tempEvents: WebBusEvent[];
	currTempIDNumber: number;
} = {
	tempIDIssued: {},
	tempEvents: [],
	currTempIDNumber: 1,
};

const getTempID = (pkg: string) => {
	(RuntimeState.tempIDIssued as any)[
		`${pkg}_${RuntimeState.currTempIDNumber}`
	] = true;
	return `${pkg}_${RuntimeState.currTempIDNumber++}`;
};

export const PostCreateEvent = (
	payload: Omit<WebCreateData, "tempID">
): string => {
	const tempID = getTempID(payload.pkg);
	const webEvent: WebBusEvent = {
		payload: { ...payload, tempID },
		type: "CREATE",
	};
	RuntimeState.tempEvents.push({ ...webEvent });
	WebBus.next({ ...webEvent });
	return tempID;
};

(window as any).PostCreateEvent = PostCreateEvent;

export const PostPatchEvent = (payload: WebPatchData): string => {
	const webEvent: WebBusEvent = {
		payload: { ...payload },
		type: "PATCH",
	};
	if (!RuntimeState.tempIDIssued[payload.tempID]) {
		throw new Error(`The tempID: ${payload.tempID} was not issued`);
	}
	RuntimeState.tempEvents.push({ ...webEvent });
	WebBus.next({ ...webEvent });
	return payload.tempID;
};

(window as any).PostPatchEvent = PostPatchEvent;
