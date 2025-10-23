import { create } from "zustand";
import { devtools } from "zustand/middleware";

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

// Get error message
const getErrorMessage = (error) => {
	if (error && error.message) return error.message;
	return String(error) || "Something went wrong";
};

const exerciseStore = create(
	devtools((set) => ({
		exercises: [],
		filterOptions: {
			equipment: [],
			primary_muscles: [],
			tags: [],
			type: [],
			modality: [],
			movement_patterns: [],
		},
		pagination: null,
		isFilterLoading: false,
		isLoading: false,
		error: null,

		// Get exercises
		getExercises: async ({ page = 1, limit = 10, ...params }) => {
			set({ isLoading: true, error: null });

			const queryParams = new URLSearchParams();
			queryParams.append("page", String(page));
			queryParams.append("limit", String(limit));
			Object.keys(params).forEach((key) => {
				const value = params[key];

				if (Array.isArray(value)) {
					value.forEach((item) => queryParams.append(key, item));
				} else if (value) {
					queryParams.append(key, value);
				}
			});

			const queryString = queryParams.toString();

			try {
				const response = await fetch(
					`${apiUrl}/exercises/getAll?${queryString}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
					}
				);
				const data = await response.json();

				if (!response.ok) {
					set({
						isLoading: false,
						error: data.message || "Request failed",
					});
					return {
						success: false,
						message: data.message || "Request failed",
					};
				}

				set({
					isLoading: false,
					error: null,
					exercises: data.data,
					pagination: {
						total: data.total,
						page: data.page,
						limit: data.limit,
						totalPages: data.totalPages,
						results: data.results,
					},
				});
				return {
					success: true,
					message: data.message || "Request successful",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Get filter options
		getFilterOptions: async () => {
			set({ isFilterLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/exercises/getFilters`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});
				const data = await response.json();
				if (!response.ok) {
					set({
						isFilterLoading: false,
						error: data.message || "Request failed",
					});
					return {
						success: false,
						message: data.message || "Request failed",
					};
				}
				set({
					isFilterLoading: false,
					error: null,
					filterOptions: data.data, // Assuming response contains filter options
				});
				return {
					success: true,
					message:
						data.message || "Filter options retrieved successfully",
				};
			} catch (error) {
				set({ isFilterLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Get exercise by ID
		getExerciseById: async (id) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/exercises/getById/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});
				const data = await response.json();
				if (!response.ok) {
					set({
						isLoading: false,
						error: data.message || "Request failed",
					});
					return {
						success: false,
						message: data.message || "Request failed",
					};
				}
				set({ isLoading: false, error: null });
				return {
					success: true,
					data: data.data,
					message: data.message || "Exercise retrieved successfully",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Create exercise
		createExercise: async (exerciseData) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/exercises/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(exerciseData),
				});
				const data = await response.json();
				if (!response.ok) {
					set({
						isLoading: false,
						error: data.message || "Request failed",
					});
					return {
						success: false,
						message: data.message || "Request failed",
					};
				}
				set({ isLoading: false, error: null });
				return {
					success: true,
					data: data.exercise,
					message: data.message || "Exercise created successfully",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Update exercise
		updateExercise: async (id, exerciseData) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/exercises/update/${id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(exerciseData),
				});
				const data = await response.json();
				if (!response.ok) {
					set({
						isLoading: false,
						error: data.message || "Request failed",
					});
					return {
						success: false,
						message: data.message || "Request failed",
					};
				}
				set({ isLoading: false, error: null });
				return {
					success: true,
					data: data.data,
					message: data.message || "Exercise updated successfully",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Delete exercise
		deleteExercise: async (id) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/exercises/delete/${id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});
				const data = await response.json();
				if (!response.ok) {
					set({
						isLoading: false,
						error: data.message || "Request failed",
					});
					return {
						success: false,
						message: data.message || "Request failed",
					};
				}
				set({ isLoading: false, error: null });
				return {
					success: true,
					message: data.message || "Exercise deleted successfully",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},
	})),
	{
		enabled: env === "development" ? true : false,
	}
);

export default exerciseStore;
