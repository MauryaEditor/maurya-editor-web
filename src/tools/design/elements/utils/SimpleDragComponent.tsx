export const SimpleDragComponent: React.FC<object> = (props: any) => {
	return (
		<div style={{ border: "1px solid black", borderRadius: "2px" }}>
			{props.name}
		</div>
	);
};
