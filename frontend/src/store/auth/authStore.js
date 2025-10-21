import { create } from "zustand";
import { devtools } from "zustand/middleware";

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
					set({
						isLoading: false,
						error: data.message || "Registration failed",
					});
					return {
						success: false,
						message: data.message || "Registration failed",
					};
				}

				// set user and authentication state
				set({
					isLoading: false,
					isAuthenticated: true,
					user: data?.user ?? data ?? null,
					error: null,
				});

				return {
					success: true,
					message: "Verification code sent to your email",
				};
			} catch (error) {
				// set error state and throw error
				set({
					isLoading: false,
					error: getErrorMessage(error),
				});
				return {
					success: false,
					message: getErrorMessage(error),
				};
			}
		},

		// verify email
		verifyEmail: async ({ email, verificationCode }) => {
			// set loading state and clear error
			set({
				isLoading: true,
				error: null,
			});

			try {
				const response = await fetch(`${apiUrl}/auth/verify-email`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						verificationCode,
					}),
				});

				const data = await response.json();
				console.log(data);

				if (!response.ok) {
					// Use the error message from the backend if available
					set({
						isLoading: false,
						error: data.message || "Verification failed",
					});
					return {
						success: false,
						message: data.message || "Verification failed",
					};
				}

				// set user and authentication state
				set({
					isLoading: false,
					isAuthenticated: true,
					user: data?.user ?? data ?? null,
					error: null,
				});

				return {
					success: true,
					message: "Verification successful",
				};
			} catch (error) {
				// set error state and throw error
				set({
					isLoading: false,
					error: getErrorMessage(error),
				});
				return {
					success: false,
					message: getErrorMessage(error),
				};
			}
		},

		// Login user
		login: async ({ email, password }) => {
			// set loading state and clear error
			set({
				isLoading: true,
				error: null,
			});

			try {
				const response = await fetch(`${apiUrl}/auth/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						password,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					// Use the error message from the backend if available
					set({
						isLoading: false,
						error: data.message || "Login failed",
					});
					return {
						success: false,
						message: data.message || "Login failed",
					};
				}

				// set user and authentication state
				set({
					isLoading: false,
					isAuthenticated: true,
					user: data?.user ?? data ?? null,
					error: null,
				});

				return {
					success: true,
					message: "Login successful",
				};
			} catch (error) {
				// set error state and throw error
				set({
					isLoading: false,
					error: getErrorMessage(error),
				});
				return {
					success: false,
					message: getErrorMessage(error),
				};
			}
		},

		// check auth
		checkAuth: async () => {
			// set loading state and clear error
			set({
				isLoading: true,
				error: null,
				isAuthenticated: false,
				user: null,
				isCheckingAuth: true,
			});

			try {
				const response = await fetch(`${apiUrl}/auth/check-auth`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					// Use the error message from the backend if available
					set({
						isLoading: false,
						error: data.message || "Check auth failed",
						isAuthenticated: false,
						user: null,
						isCheckingAuth: false,
					});
					return {
						success: false,
						message: data.message || "Check auth failed",
					};
				}

				// set user and authentication state
				set({
					isLoading: false,
					isAuthenticated: data?.user?.isAuthenticated ?? false,
					user: data?.user ?? data ?? null,
					error: null,
					isCheckingAuth: false,
				});

				return {
					success: true,
					message: "Check auth successful",
				};
			} catch (error) {
				// set error state and throw error
				set({
					isLoading: false,
					error: getErrorMessage(error),
					isAuthenticated: false,
					user: null,
					isCheckingAuth: false,
				});
				return {
					success: false,
					message: getErrorMessage(error),
				};
			}
		},
	})),

	{
		enabled: env === "development" ? true : false, // enable devtools only in development
	}
);
