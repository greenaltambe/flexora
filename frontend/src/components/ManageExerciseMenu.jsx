import exerciseStore from "../store/exercise/exerciseStore";
import { useState, useEffect, useCallback } from "react";
import CreateExerciseButton from "./CreateExerciseButton";
import SearchBarComponent from "./SearchBarComponent";
import FilterBarComponent from "./FilterBarComponent";
import ExerciseListComponent from "./ExerciseListComponent";
import Pagination from "./Pagination";
import Loader from "./Loader";

const PAGE_LIMIT = 10;

const LoadingCenter = () => (
	<div className="flex justify-center items-center min-h-[280px]">
		<Loader />
	</div>
);

// empty state - when no exercises are found
const EmptyState = () => (
	<div className="p-6 text-center">
		<div className="text-lg font-semibold mb-2">No exercises found</div>
		<p className="text-sm mb-4 text-base-content/70">
			Try adjusting filters or press refresh.
		</p>
	</div>
);

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

	// initial load
	useEffect(() => {
		getFilterOptions();
		getExercises({ page: 1, limit: PAGE_LIMIT });
	}, [getFilterOptions, getExercises]);

	const handleFilterChange = useCallback((newFilters) => {
		setFilters(newFilters);
	}, []);

	const handleSearch = useCallback((term) => {
		setSearch(term);
	}, []);

	const applyQuery = useCallback(
		(page = 1) => {
			const payload = {
				page,
				limit: PAGE_LIMIT,
				...(search ? { name: search } : {}),
				...filters,
			};
			getExercises(payload);
		},
		[getExercises, search, filters]
	);

	const handleApplyFilters = useCallback(() => applyQuery(1), [applyQuery]);
	const handlePageChange = useCallback(
		(newPage) => applyQuery(newPage),
		[applyQuery]
	);
	const handleRefresh = useCallback(
		() => applyQuery(pagination?.page || 1),
		[applyQuery, pagination]
	);

	if (isLoading || isFilterLoading) return <LoadingCenter />;
	if (error)
		return (
			<div className="mx-auto max-w-4xl">
				<div className="alert alert-error shadow-lg">
					<div>
						<span>{error}</span>
					</div>
				</div>
			</div>
		);

	return (
		<div className="card bg-base-100 shadow-lg">
			<div className="card-body p-4 md:p-6">
				{/* Header */}
				<div className="flex items-start justify-between gap-4 mb-4">
					<div className="flex items-center gap-2">
						<div className="flex-1">
							<SearchBarComponent
								onSearch={handleSearch}
								onApply={handleApplyFilters}
							/>
						</div>
						<button
							className="btn btn-ghost btn-sm"
							onClick={handleRefresh}
							title="Refresh list"
						>
							Refresh
						</button>
						<CreateExerciseButton />
					</div>
				</div>

				{/* Get total count */}
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
					<div className="text-sm text-base-content/70 md:ml-4">
						<div>
							<strong>
								{pagination?.total || exercises.length}
							</strong>{" "}
							exercise
							{(pagination?.total || exercises.length) !== 1
								? "s"
								: ""}
						</div>
					</div>
				</div>

				{/* Main body: responsive two-column layout */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
					<div className="md:col-span-3">
						<div className="card bg-base-200 p-3 sticky top-4">
							<FilterBarComponent
								filterOptions={filterOptions}
								filters={filters}
								onFilterChange={handleFilterChange}
								onApply={handleApplyFilters}
							/>
						</div>
					</div>

					{/* List column */}
					<main className="md:col-span-9">
						<div className="space-y-4">
							{exercises.length === 0 ? (
								<EmptyState onRefresh={handleRefresh} />
							) : (
								<div className="card bg-base-100 shadow-sm">
									<div className="card-body p-3">
										<ExerciseListComponent
											exercises={exercises}
											onRefresh={handleRefresh}
										/>
									</div>
								</div>
							)}

							<div className="flex items-center justify-end">
								<Pagination
									pagination={pagination}
									onPageChange={handlePageChange}
								/>
							</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};

export default ManageExerciseMenu;
