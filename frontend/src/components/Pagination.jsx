const Pagination = ({ pagination, onPageChange }) => {
	if (!pagination) return null;

	const { page, totalPages } = pagination;

	return (
		<div className="btn-group mt-4">
			<div className="join">
				<button
					className="join-item btn"
					disabled={page === 1}
					onClick={() => onPageChange(page - 1)}
				>
					«
				</button>
				<button className="join-item btn">{page}</button>
				<button
					className="join-item btn"
					disabled={page === totalPages}
					onClick={() => onPageChange(page + 1)}
				>
					»
				</button>
			</div>
		</div>
	);
};

export default Pagination;
