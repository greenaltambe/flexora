import { useState } from "react";

const FilterBarComponent = ({ filterOptions, onFilterChange }) => {
	const [filters, setFilters] = useState({
		equipment: [],
		primary_muscles: [],
		tags: [],
		type: [],
		modality: [],
		movement_patterns: [],
	});

	const handleFilterChange = (category, value) => {
		setFilters((prev) => {
			const newValues = prev[category].includes(value)
				? prev[category].filter((v) => v !== value)
				: [...prev[category], value];
			const newFilters = { ...prev, [category]: newValues };
			onFilterChange(newFilters);
			return newFilters;
		});
	};

	return (
		<div className="flex flex-wrap gap-4 mb-4">
			{Object.keys(filterOptions).map((category) => (
				<div key={category} className="dropdown">
					<label
						tabIndex={0}
						className="btn btn-outline btn-sm capitalize"
					>
						{category.replace("_", " ")}
					</label>
					<ul
						tabIndex={0}
						className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-60 overflow-y-auto"
					>
						{filterOptions[category].map((option) => (
							<li key={option}>
								<label className="label cursor-pointer">
									<span className="label-text">{option}</span>
									<input
										type="checkbox"
										checked={filters[category].includes(
											option
										)}
										onChange={() =>
											handleFilterChange(category, option)
										}
										className="checkbox"
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
