import { create } from "zustand";
import { devtools } from "zustand/middleware";

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

const getErrorMessage = (error) => {
	if (error && error.message) return error.message;
	return String(error) || "Something went wrong";
};

export const useStreakStore = create(
	devtools((set) => ({
		streak: null,
		summary: null,
		status: null,
		milestones: [],
		milestoneDefinitions: {},
		consistency: null,
		isLoading: false,
		error: null,

		// Get streak data
		getStreak: async () => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/streak/`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					streak: data.streak || {
						currentStreak: 0,
						longestStreak: 0,
						totalWorkouts: 0,
						lastWorkoutDate: null,
					},
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.streak };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Get streak summary
		getStreakSummary: async () => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/streak/summary`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					summary: data.summary,
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.summary };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Check streak status
		checkStreakStatus: async () => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/streak/status`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					status: data.status,
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.status };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Add freeze day
		addFreezeDay: async (date, reason) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/streak/freeze`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ date, reason }),
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				// Update local streak data
				set((state) => ({
					streak: { ...state.streak, ...data.streak },
					isLoading: false,
					error: null,
				}));

				return {
					success: true,
					data: data.streak,
					message: data.message,
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Get milestones
		getMilestones: async () => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/streak/milestones`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					milestones: data.milestones || [],
					milestoneDefinitions: data.definitions || {},
					isLoading: false,
					error: null,
				});

				return {
					success: true,
					milestones: data.milestones,
					definitions: data.definitions,
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Acknowledge milestone
		acknowledgeMilestone: async (type) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(
					`${apiUrl}/streak/milestone/${type}/acknowledge`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
					}
				);

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				// Update local milestones
				set((state) => ({
					milestones: state.milestones.map((m) =>
						m.type === type ? { ...m, acknowledged: true } : m
					),
					isLoading: false,
					error: null,
				}));

				return {
					success: true,
					data: data.streak,
					message: data.message,
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Get weekly consistency
		getWeeklyConsistency: async () => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/streak/consistency`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					consistency: data.consistency,
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.consistency };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Clear error
		clearError: () => set({ error: null }),
	})),
	{
		enabled: env === "development",
		name: "streak-store",
	}
);
