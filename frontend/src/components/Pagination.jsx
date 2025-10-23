const Pagination = ({ pagination, onPageChange }) => {
	if (!pagination) return null;

	const { page, totalPages } = pagination;

	return (
		<div className="btn-group mt-4">
			<div class="join">
				<button
					class="join-item btn"
					disabled={page === 1}
					onClick={() => onPageChange(page - 1)}
				>
					«
				</button>
				<button class="join-item btn">{page}</button>
				<button
					class="join-item btn"
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
