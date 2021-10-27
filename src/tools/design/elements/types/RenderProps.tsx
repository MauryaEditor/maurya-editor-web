// TODO-Done: remove bus becaue ID is included
export type RenderProps = { [key: string | number]: any } & {
	ID: string;
	style?: React.CSSProperties;
	properties?: { [key: string | number]: any };
};
