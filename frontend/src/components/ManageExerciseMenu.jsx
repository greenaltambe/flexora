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

	const [filters, setFilters] = useState({});
	const [search, setSearch] = useState("");

	useEffect(() => {
		getFilterOptions();
	}, [getFilterOptions]);

	useEffect(() => {
		getExercises({ page: 1, limit: 10, name: search, ...filters });
	}, [filters, search, getExercises]);

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
	};

	const handleSearch = (term) => {
		setSearch(term);
	};

	const handlePageChange = (newPage) => {
		getExercises({ page: newPage, limit: 10, name: search, ...filters });
	};

	if (isLoading || isFilterLoading)
		return <div className="text-center">Loading...</div>;
	if (error) return <div className="alert alert-error">{error}</div>;

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Manage Exercises</h1>
			<CreateExerciseButton />
			<SearchBarComponent onSearch={handleSearch} />
			<FilterBarComponent
				filterOptions={filterOptions}
				onFilterChange={handleFilterChange}
			/>
			{exercises.length === 0 ? (
				<div className="text-center">No exercises found.</div>
			) : (
				<ExerciseListComponent exercises={exercises} />
			)}
			<Pagination
				pagination={pagination}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default ManageExerciseMenu;
