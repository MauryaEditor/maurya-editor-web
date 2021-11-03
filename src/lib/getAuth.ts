export const getAuth = () => {
	const token = localStorage.getItem("token");
	return { token };
};
