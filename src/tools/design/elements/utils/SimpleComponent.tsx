export const SimpleComponent: React.FC<object> = (props: any) => {
	return (
		<div style={{ height: "2em", position: "relative" }}>
			<span
				style={{
					position: "absolute",
					top: "50%",
					left: "0.5em",
					transform: "translate(0, -50%)",
				}}
			>
				{props.name}
			</span>
		</div>
	);
};
