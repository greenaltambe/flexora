import { create } from "zustand";
import { devtools } from "zustand/middleware";

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

const getErrorMessage = (error) => {
	if (error && error.message) return error.message;
	return String(error) || "Something went wrong";
};

export const useSessionLogStore = create(
	devtools((set, get) => ({
		sessionLogs: [],
		currentLog: null,
		isLoading: false,
		error: null,

		// Submit session log for a specific date
		submitSessionLog: async (date, entries) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/session/${date}/log`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ entries }),
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					currentLog: data.savedLog,
					isLoading: false,
					error: null,
				});

				return {
					success: true,
					data: data.savedLog,
					message: data.message || "Session logged successfully",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Get session log for a specific date
		getSessionLog: async (date) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/session/${date}/log`, {
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
					currentLog: data.log,
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.log };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Clear current log
		clearCurrentLog: () => set({ currentLog: null }),

		// Clear error
		clearError: () => set({ error: null }),
	})),
	{
		enabled: env === "development",
		name: "session-log-store",
	}
);
