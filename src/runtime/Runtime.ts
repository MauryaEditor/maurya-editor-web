import {
	WebBus,
	WebBusEvent,
	WebCreateData,
	WebPatchData,
} from "../rxjs/EditorConfig";

export const RuntimeState: {
	IDIssued: any;
	tempEvents: WebBusEvent[];
	currIndex: number;
	IDBank: { payload: string[]; token: string }[];
	currSyncIndex: number;
} = {
	IDIssued: {},
	tempEvents: [],
	currIndex: 0,
	IDBank: [],
	currSyncIndex: 0,
};

const fetchIDs = async (size: number) => {
	const uri = `${process.env.REACT_APP_BACKEND_ORIGIN}/uuid?size=${size}`;
	const uris = await fetch(uri).then((resp) => resp.json());
	return uris;
};

const storeIDsAt = (index: number, payload: string[], token: string) => {
	RuntimeState.IDBank[index] = { payload, token };
};

const AccountSize = 20;

const InitRuntime = async () => {
	let { payload, token }: { payload: string[]; token: string } =
		await fetchIDs(AccountSize);
	storeIDsAt(0, payload, token);
};

InitRuntime()
	.then(() => {
		console.log("Runtime Init success", RuntimeState);
	})
	.catch((err) => {
		console.error("Runtime Init failed", err);
	});

const getID = (): string => {
	const ID =
		RuntimeState.IDBank[Math.floor(RuntimeState.currIndex / AccountSize)]
			?.payload[RuntimeState.currIndex % AccountSize];
	RuntimeState.currIndex++;
	if (RuntimeState.currIndex % AccountSize === 0) {
		fetchIDs(AccountSize).then(
			(val: { payload: string[]; token: string }) => {
				storeIDsAt(
					Math.floor(RuntimeState.currIndex / AccountSize),
					val.payload,
					val.token
				);
			}
		);
	}
	if (ID) {
		(RuntimeState.IDIssued as any)[ID] = true;
		return ID;
	} else {
		throw new Error("ID Bank is bankrupt");
	}
};

export const PostCreateEvent = (
	payload: Omit<WebCreateData, "tempID">
): string => {
	const ID = getID();
	const webEvent: WebBusEvent = {
		payload: { ...payload, ID },
		type: "CREATE",
	};
	RuntimeState.tempEvents.push({ ...webEvent });
	WebBus.next({ ...webEvent });
	return ID;
};

(window as any).PostCreateEvent = PostCreateEvent;

export const PostPatchEvent = (payload: WebPatchData): string => {
	const webEvent: WebBusEvent = {
		payload: { ...payload },
		type: "PATCH",
	};
	RuntimeState.tempEvents.push({ ...webEvent });
	WebBus.next({ ...webEvent });
	return payload.ID;
};

(window as any).PostPatchEvent = PostPatchEvent;

// send event
const sendEvent = (event: WebBusEvent) => {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	const options = {
		method: "POST",
		headers: headers,
		body: JSON.stringify(event),
	};
	return fetch(
		`${process.env.REACT_APP_BACKEND_ORIGIN}/web-events`,
		options
	).then((resp) => resp.json());
};
// send events to backend
WebBus.subscribe(async (event) => {
	for (
		let i = RuntimeState.currSyncIndex;
		i < RuntimeState.tempEvents.length;
		i++
	) {
		await sendEvent(RuntimeState.tempEvents[RuntimeState.currSyncIndex]);
		RuntimeState.currSyncIndex++;
	}
});
