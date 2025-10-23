const Pagination = ({ pagination, onPageChange }) => {
	if (!pagination) return null;

	const { page, totalPages } = pagination;

	return (
		<div className="btn-group mt-4">
			<button
				className="btn btn-outline"
				disabled={page === 1}
				onClick={() => onPageChange(page - 1)}
			>
				Previous
			</button>
			<button className="btn btn-active">{page}</button>
			<button
				className="btn btn-outline"
				disabled={page === totalPages}
				onClick={() => onPageChange(page + 1)}
			>
				Next
			</button>
		</div>
	);
};

export default Pagination;
