import { BehaviorSubject } from "rxjs";

export type RenderProps = {
	bus: BehaviorSubject<any>;
	style?: React.CSSProperties;
	children?: HTMLElement | string;
	attributes?: { [key: string]: string | number | boolean };
};
