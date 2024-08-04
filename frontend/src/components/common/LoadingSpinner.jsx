const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;

	return <span className={`loading loading-spinner ${sizeClass} text-secondary`} />;
};
export default LoadingSpinner;