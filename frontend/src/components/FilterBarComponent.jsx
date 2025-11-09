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
				<div className="flex items-center gap-2 mb-4">
					<Filter className="w-5 h-5" />
					<h3 className="font-semibold">Filters</h3>
				</div>

				<div className="space-y-2">
					{Object.keys(filterOptions).map((category) => (
						<div
							key={category}
							className="dropdown dropdown-end w-full"
						>
							<label
								tabIndex={0}
								className="btn btn-outline btn-sm capitalize w-full justify-between"
							>
								<span className="truncate">
									{category.replace(/_/g, " ")}
								</span>
								{filters[category] &&
									filters[category].length > 0 && (
										<span className="badge badge-primary badge-xs">
											{filters[category].length}
										</span>
									)}
							</label>
							<ul
								tabIndex={0}
								className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-50 mt-1"
							>
								{filterOptions[category].map((option) => (
									<li key={option}>
										<label className="label cursor-pointer justify-start gap-2 py-2">
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
												className="checkbox checkbox-primary checkbox-sm"
											/>
											<span className="label-text text-sm flex-1">
												{option}
											</span>
										</label>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="flex flex-col gap-2 mt-4">
					<button
						type="button"
						onClick={onApply}
						className="btn btn-primary btn-sm w-full gap-2"
					>
						<Filter className="w-4 h-4" />
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
							className="btn btn-ghost btn-sm w-full"
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
