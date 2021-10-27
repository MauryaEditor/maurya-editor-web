import { useEffect, useState } from "react";
declare interface WebPatchData {
	tempID: string;
	slice: { [key: string | number]: any };
}
declare const PostPatchEvent: (payload: WebPatchData) => string;

// Simplification-7 Take ID as props rather than bus
export const TextProperty: React.FC<{
	ID: string;
	propertyName: string;
	initialValue: string;
}> = (props) => {
	// Publish to bus on value change
	const [value, setValue] = useState<string>(props.initialValue);
	useEffect(() => {
		// Simplification-8 PostPatchEvent instead of publishing on bus
		PostPatchEvent({
			tempID: props.ID,
			slice: { properties: { [props.propertyName]: value } },
		});
	}, [props.ID, props.propertyName, value]);

	return (
		<div>
			<span>{props.propertyName}</span>
			<input
				type="text"
				onChange={(event) => {
					setValue(event.target.value);
				}}
				value={value}
			/>
		</div>
	);
};
