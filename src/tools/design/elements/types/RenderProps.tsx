import { BehaviorSubject } from "rxjs";

// TODO: remove bus becaue ID is included
export type RenderProps = {
	bus: BehaviorSubject<any>;
	ID: string;
	style?: React.CSSProperties;
	children?: HTMLElement | string;
	attributes?: { [key: string]: string | number | boolean };
};
