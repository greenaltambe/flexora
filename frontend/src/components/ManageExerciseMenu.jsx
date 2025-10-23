import exerciseStore from "../store/exercise/exerciseStore";
import { useState, useEffect } from "react";
import CreateExerciseButton from "./CreateExerciseButton";
import SearchBarComponent from "./SearchBarComponent";
import FilterBarComponent from "./FilterBarComponent";
import ExerciseListComponent from "./ExerciseListComponent";
import Pagination from "./Pagination";

const ManageExerciseMenu = () => {
	const {
		exercises,
		filterOptions,
		pagination,
		isLoading,
		isFilterLoading,
		error,
		getExercises,
		getFilterOptions,
	} = exerciseStore();

	const [filters, setFilters] = useState({
		equipment: [],
		primary_muscles: [],
		tags: [],
		type: [],
		modality: [],
		movement_patterns: [],
	});
	const [search, setSearch] = useState("");

	useEffect(() => {
		getFilterOptions();
		getExercises({ page: 1, limit: 10 });
	}, [getFilterOptions, getExercises]);

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
	};

	const handleSearch = (term) => {
		setSearch(term);
	};

	const handleApplyFilters = () => {
		getExercises({ page: 1, limit: 10, name: search, ...filters });
	};

	const handlePageChange = (newPage) => {
		getExercises({ page: newPage, limit: 10, name: search, ...filters });
	};

	const handleRefresh = () => {
		getExercises({ page: pagination?.page || 1, limit: 10, name: search, ...filters });
	};

	if (isLoading || isFilterLoading)
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		);
	if (error) return <div className="alert alert-error">{error}</div>;

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Manage Exercises</h1>
			<CreateExerciseButton />
			<div className="mb-4">
				<SearchBarComponent onSearch={handleSearch} onApply={handleApplyFilters} />
			</div>
			<div className="mb-4">
				<FilterBarComponent
					filterOptions={filterOptions}
					filters={filters}
					onFilterChange={handleFilterChange}
					onApply={handleApplyFilters}
				/>
			</div>
			{exercises.length === 0 ? (
				<div className="text-center alert alert-info">
					No exercises found.
				</div>
			) : (
				<ExerciseListComponent exercises={exercises} onRefresh={handleRefresh} />
			)}
			<Pagination
				pagination={pagination}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default ManageExerciseMenu;
