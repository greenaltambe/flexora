const FilterBarComponent = ({ filterOptions, filters, onFilterChange }) => {
	const handleFilterChange = (category, value) => {
		const currentValues = filters[category] || [];
		const newValues = currentValues.includes(value)
			? currentValues.filter((v) => v !== value)
			: [...currentValues, value];
		const newFilters = { ...filters, [category]: newValues };
		onFilterChange(newFilters);
	};

	return (
		<div className="flex flex-wrap gap-4 mb-4">
			{Object.keys(filterOptions).map((category) => (
				<div key={category} className="dropdown dropdown-end">
					<label
						tabIndex={0}
						className="btn btn-outline btn-sm capitalize"
					>
						{category.replace("_", " ")}
						{filters[category] && filters[category].length > 0 && (
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
									<span className="label-text">{option}</span>
									<input
										type="checkbox"
										checked={filters[category]?.includes(option) || false}
										onChange={() =>
											handleFilterChange(category, option)
										}
										className="checkbox checkbox-primary"
									/>
								</label>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default FilterBarComponent;
