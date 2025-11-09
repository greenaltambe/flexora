import { create } from "zustand";
import { devtools } from "zustand/middleware";

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

const getErrorMessage = (error) => {
	if (error && error.message) return error.message;
	return String(error) || "Something went wrong";
};

export const useDietStore = create(
	devtools((set) => ({
		recommendation: null,
		dailySessions: {},
		mealLogs: {},
		recipes: [],
		isLoading: false,
		error: null,

		// Get diet recommendation
		getDietRecommendation: async (date = null, mealsPerDay = null) => {
			set({ isLoading: true, error: null });
			try {
				const params = new URLSearchParams();
				if (date) params.append("date", date);
				if (mealsPerDay) params.append("meals_per_day", mealsPerDay);

				const response = await fetch(
					`${apiUrl}/diet/recommendation?${params.toString()}`,
					{
						method: "GET",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
					}
				);

				const data = await response.json();

				if (!response.ok || !data.success) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					recommendation: data.data,
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.data };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Save daily meal session
		saveDailySession: async (date, meals) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/diet/session/${date}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ meals }),
				});

				const data = await response.json();

				if (!response.ok || !data.success) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				// Store session by date
				set((state) => ({
					dailySessions: {
						...state.dailySessions,
						[date]: data.session,
					},
					isLoading: false,
					error: null,
				}));

				return {
					success: true,
					data: data.session,
					message: "Meal session saved successfully",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Log meals
		logMeals: async (date, entries) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(
					`${apiUrl}/diet/meals/log/${date}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({ entries }),
					}
				);

				const data = await response.json();

				if (!response.ok || !data.success) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				// Store log by date
				set((state) => ({
					mealLogs: {
						...state.mealLogs,
						[date]: data.savedLog,
					},
					isLoading: false,
					error: null,
				}));

				return {
					success: true,
					data: data.savedLog,
					message: "Meals logged successfully",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Search recipes
		searchRecipes: async (
			query = "",
			cal = null,
			maxPrepMinutes = null
		) => {
			set({ isLoading: true, error: null });
			try {
				const params = new URLSearchParams();
				if (query) params.append("q", query);
				if (cal) params.append("cal", cal);
				if (maxPrepMinutes)
					params.append("maxPrepMinutes", maxPrepMinutes);

				const response = await fetch(
					`${apiUrl}/diet/recipes/search?${params.toString()}`,
					{
						method: "GET",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
					}
				);

				const data = await response.json();

				if (!response.ok || !data.success) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					recipes: data.results || [],
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.results };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Get daily session by date
		getDailySession: (date) => {
			const state = useDietStore.getState();
			return state.dailySessions[date] || null;
		},

		// Get meal log by date
		getMealLog: (date) => {
			const state = useDietStore.getState();
			return state.mealLogs[date] || null;
		},

		// Clear data
		clearRecommendation: () => set({ recommendation: null }),
		clearRecipes: () => set({ recipes: [] }),
		clearError: () => set({ error: null }),
	})),
	{
		enabled: env === "development",
		name: "diet-store",
	}
);
