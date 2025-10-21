import { create } from "zustand";
import { devtools } from "zustand/middleware";
// import axios from "axios"; // No longer needed for this part

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

const getErrorMessage = (error) => {
	// Simplified error message function without axios
	if (error && error.message) return error.message;
	return String(error) || "Something went wrong";
};

export const useAuthStore = create(
	devtools((set) => ({
		user: null,
		isAuthenticated: false,
		error: null,
		isLoading: false,
		isCheckingAuth: true,

		// Register user
		register: async ({ firstName, lastName, email, password }) => {
			// set loading state and clear error
			set({
				isLoading: true,
				error: null,
			});

			// get response from backend
			try {
				const response = await fetch(`${apiUrl}/auth/register`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						firstName,
						lastName,
						email,
						password,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					// Use the error message from the backend if available
					throw new Error(data.message || "Registration failed");
				}

				// set user and authentication state
				set({
					isLoading: false,
					isAuthenticated: true,
					user: data?.user ?? data ?? null,
				});

				return data;
			} catch (error) {
				// set error state and throw error
				set({
					isLoading: false,
					error: getErrorMessage(error),
				});
				throw error;
			}
		},

		// Login user
		login: async ({ email, password }) => {
			// set loading state and clear error
		},
	})),

	{
		enabled: env === "development" ? true : false, // enable devtools only in development
	}
);
