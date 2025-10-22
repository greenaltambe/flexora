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
		isLoading: false,
		error: null,

		// Get exercises
		getExercises: async ({ page = 1, limit = 10, ...params }) => {
			set({ isLoading: true, error: null });

			const queryParams = new URLSearchParams(params).toString();

			try {
				const response = await fetch(
					`${apiUrl}/exercises?page=${page}&limit=${limit}&${queryParams}`,
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
				set({ isLoading: false, error: null });
				return {
					success: true,
					message: data.message || "Request successful",
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
