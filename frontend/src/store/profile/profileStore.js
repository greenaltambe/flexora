import { create } from "zustand";
import { devtools } from "zustand/middleware";

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

const getErrorMessage = (error) => {
	if (error && error.message) return error.message;
	return String(error) || "Something went wrong";
};

export const useProfileStore = create(
	devtools((set) => ({
		profile: null,
		users: [],
		isLoading: false,
		error: null,

		// Get current user's profile
		getProfile: async () => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/profile/`, {
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
					profile: data.user,
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.user };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Update profile
		updateProfile: async (updates) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/profile/`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify(updates),
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					profile: data.user,
					isLoading: false,
					error: null,
				});

				return {
					success: true,
					data: data.user,
					message: "Profile updated successfully",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Complete onboarding
		completeOnboarding: async (profileData, skipBaseline = false) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/profile/onboard`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						profile: profileData,
						skipBaseline,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({
					profile: data.user,
					isLoading: false,
					error: null,
				});

				return {
					success: true,
					data: data.user,
					message: "Onboarding completed successfully",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Get all users (Admin only)
		getAllUsers: async () => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/profile/users`, {
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
					users: data.users || [],
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.users };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Get user by ID (Admin only)
		getUserById: async (userId) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(
					`${apiUrl}/profile/users/${userId}`,
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
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.user };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Force complete onboarding (Admin only)
		forceCompleteOnboarding: async (userId) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(
					`${apiUrl}/profile/users/${userId}/force-complete`,
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

				// Update local users list if it exists
				set((state) => ({
					users: state.users.map((u) =>
						u._id === userId
							? { ...u, onboardingCompleted: true }
							: u
					),
					isLoading: false,
					error: null,
				}));

				return {
					success: true,
					data: data.user,
					message: "Onboarding completed successfully",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Clear profile
		clearProfile: () => set({ profile: null, users: [] }),

		// Clear error
		clearError: () => set({ error: null }),
	})),
	{
		enabled: env === "development",
		name: "profile-store",
	}
);
