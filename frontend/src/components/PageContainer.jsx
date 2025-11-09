const PageContainer = ({ children, maxWidth = "7xl" }) => {
	const maxWidthClass = {
		"4xl": "max-w-4xl",
		"5xl": "max-w-5xl",
		"6xl": "max-w-6xl",
		"7xl": "max-w-7xl",
		"full": "max-w-full",
	}[maxWidth];

	return (
		<div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-6`}>
			{children}
		</div>
	);
};

export default PageContainer;
