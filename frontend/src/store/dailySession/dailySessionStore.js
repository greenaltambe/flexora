import { create } from "zustand";
import { devtools } from "zustand/middleware";

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

const getErrorMessage = (error) => {
	if (error && error.message) return error.message;
	return String(error) || "Something went wrong";
};

export const useDailySessionStore = create(
	devtools((set) => ({
		todaySession: null,
		currentSession: null,
		isLoading: false,
		error: null,

		getTodaySession: async () => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/daily-session/today`, {
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
					todaySession: data.session,
					isLoading: false,
					error: null,
				});
				return { success: true, data: data.session };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		getSessionByDate: async (date) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(
					`${apiUrl}/daily-session/${date}`,
					{
						method: "GET",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
					}
				);

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					currentSession: data.session,
					isLoading: false,
					error: null,
				});
				return { success: true, data: data.session };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		clearSessions: () => set({ todaySession: null, currentSession: null }),
	})),
	{
		enabled: env === "development",
	}
);
