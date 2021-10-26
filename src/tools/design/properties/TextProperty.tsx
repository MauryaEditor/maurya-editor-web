import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

export const TextProperty: React.FC<{
	bus: BehaviorSubject<any>;
	propertyName: string;
	initialValue: string;
}> = (props) => {
	// Publish to bus on value change
	const [value, setValue] = useState<string>(props.initialValue);
	useEffect(() => {
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
