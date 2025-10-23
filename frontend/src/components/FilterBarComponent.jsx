import { Filter } from "lucide-react";

const FilterBarComponent = ({
	filterOptions,
	filters,
	onFilterChange,
	onApply,
}) => {
	const handleFilterChange = (category, value) => {
		const currentValues = filters[category] || [];
		const newValues = currentValues.includes(value)
			? currentValues.filter((v) => v !== value)
			: [...currentValues, value];
		const newFilters = { ...filters, [category]: newValues };
		onFilterChange(newFilters);
	};

	const hasActiveFilters = Object.values(filters).some(
		(arr) => arr && arr.length > 0
	);

	return (
		<div className="card">
			<div className="card-body p-4">
				<div className="card-title">Filters</div>
				<div className="flex flex-wrap gap-4 items-center">
					{Object.keys(filterOptions).map((category) => (
						<div
							key={category}
							className="dropdown dropdown-bottom"
						>
							<label
								tabIndex={0}
								className="btn btn-outline btn-sm capitalize"
							>
								{category.replace("_", " ")}
								{filters[category] &&
									filters[category].length > 0 && (
										<span className="badge badge-primary badge-sm ml-2">
											{filters[category].length}
										</span>
									)}
							</label>
							<ul
								tabIndex={0}
								className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-60 overflow-y-auto z-50"
							>
								{filterOptions[category].map((option) => (
									<li key={option}>
										<label className="label cursor-pointer">
											<span className="label-text">
												{option}
											</span>
											<input
												type="checkbox"
												checked={
													filters[category]?.includes(
														option
													) || false
												}
												onChange={() =>
													handleFilterChange(
														category,
														option
													)
												}
												className="checkbox checkbox-primary"
											/>
										</label>
									</li>
								))}
							</ul>
						</div>
					))}
					<button
						type="button"
						onClick={onApply}
						className="btn btn-primary btn-sm"
					>
						<Filter className="w-4 h-4 mr-2" />
						Apply Filters
					</button>
					{hasActiveFilters && (
						<button
							type="button"
							onClick={() => {
								onFilterChange({
									equipment: [],
									primary_muscles: [],
									tags: [],
									type: [],
									modality: [],
									movement_patterns: [],
								});
							}}
							className="btn btn-ghost btn-sm"
						>
							Clear All
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default FilterBarComponent;
