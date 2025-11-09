import { create } from "zustand";
import { devtools } from "zustand/middleware";

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

const getErrorMessage = (error) => {
	if (error && error.message) return error.message;
	return String(error) || "Something went wrong";
};

export const useUserPlanStore = create(
	devtools((set) => ({
		userPlan: null,
		isLoading: false,
		error: null,

		assignPlanToUser: async (templateId) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(
					`${apiUrl}/user-plan/assign/${templateId}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
					}
				);

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({ userPlan: data.userPlan, isLoading: false, error: null });
				return { success: true, data: data.userPlan };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		getUserPlan: async () => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/user-plan/`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({ userPlan: data.userPlan, isLoading: false, error: null });
				return { success: true, data: data.userPlan };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		clearUserPlan: () => set({ userPlan: null }),
	})),
	{
		enabled: env === "development",
	}
);
