import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

// Simplification-7 Take ID as props rather than bus
export const TextProperty: React.FC<{
	bus: BehaviorSubject<any>;
	propertyName: string;
	initialValue: string;
}> = (props) => {
	// Publish to bus on value change
	const [value, setValue] = useState<string>(props.initialValue);
	useEffect(() => {
		// Simplification-8 PostPatchEvent instead of publishing on bus
		props.bus.next({ properties: { [props.propertyName]: value } });
	}, [props.bus, props.propertyName, value]);

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
