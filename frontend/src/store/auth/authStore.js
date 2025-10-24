import { create } from "zustand";
import { devtools } from "zustand/middleware";

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

// Error message function
const getErrorMessage = (error) => {
	if (error && error.message) return error.message;
	return String(error) || "Something went wrong";
};

// Create auth store
export const useAuthStore = create(
	devtools((set) => ({
		user: null,
		isAuthenticated: false,
		error: null,
		isLoading: false,
		isCheckingAuth: true,

		// Register user
		register: async ({ firstName, lastName, email, password, role }) => {
			set({
				isLoading: true,
				error: null,
			});

			try {
				// Register user call
				const response = await fetch(`${apiUrl}/auth/register`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include", // Include cookies in the request
					body: JSON.stringify({
						firstName,
						lastName,
						email,
						password,
						// Allow role to be sent explicitly for admin via Postman; UI won't send role
						...(role ? { role } : {}),
					}),
				});

				const data = await response.json(); // Parse response as JSON

				// Check if response is ok if not set error and return
				if (!response.ok) {
					set({
						isLoading: false,
						error: data.message || "Registration failed",
					});
					return {
						success: false,
						message: data.message || "Registration failed",
					};
				}

				// Set user and authentication state
				set({
					isLoading: false,
					isAuthenticated: false, // User needs to verify email first before being authenticated
					user: data?.user ?? null,
					error: null,
				});

				return {
					success: true,
					message: "Verification code sent to your email",
				};
			} catch (error) {
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
			set({
				isLoading: true,
				error: null,
			});

			try {
				// Verify email call
				const response = await fetch(`${apiUrl}/auth/verify-email`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include", // Include cookies in the request
					body: JSON.stringify({
						email,
						verificationCode,
					}),
				});

				const data = await response.json(); // Parse response as JSON

				// Check if response is ok if not set error and return
				if (!response.ok) {
					set({
						isLoading: false,
						error: data.message || "Verification failed",
					});
					return {
						success: false,
						message: data.message || "Verification failed",
					};
				}

				// After successful verification, user is authenticated
				set({
					isLoading: false,
					isAuthenticated: true,
					user: data?.user ?? null,
					error: null,
				});

				return {
					success: true,
					message: "Verification successful",
				};
			} catch (error) {
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
			set({
				isLoading: true,
				error: null,
			});

			try {
				// Login user call
				const response = await fetch(`${apiUrl}/auth/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include", // Include cookies in the request
					body: JSON.stringify({
						email,
						password,
					}),
				});

				const data = await response.json(); // Parse response as JSON

				// Check if response is ok if not set error and return
				if (!response.ok) {
					set({
						isLoading: false,
						error: data.message || "Login failed",
					});
					return {
						success: false,
						message: data.message || "Login failed",
					};
				}

				// Set user and authentication state
				set({
					isLoading: false,
					isAuthenticated: true,
					user: data?.user ?? null,
					error: null,
				});

				return {
					success: true,
					message: "Login successful",
				};
			} catch (error) {
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

		// Forgot password
		forgotPassword: async ({ email }) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/auth/forgot-password`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ email }),
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
				return { success: true, message: data.message || "Email sent" };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// Reset password
		resetPassword: async ({ token, password }) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(
					`${apiUrl}/auth/reset-password/${token}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({ password }),
					}
				);
				const data = await response.json();
				if (!response.ok) {
					set({
						isLoading: false,
						error: data.message || "Reset failed",
					});
					return {
						success: false,
						message: data.message || "Reset failed",
					};
				}
				set({
					isLoading: false,
					error: null,
					isAuthenticated: true,
					user: data?.user ?? null,
				});
				return {
					success: true,
					message: data.message || "Password reset",
				};
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		// check if user is authenticated
		checkAuth: async () => {
			set({
				isCheckingAuth: true,
			});

			try {
				const response = await fetch(`${apiUrl}/auth/check-auth`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include", // Include cookies in the request
				});

				const data = await response.json(); // Parse response as JSON

				// Check if response is ok if not set error and return
				if (!response.ok) {
					set({
						isLoading: false,
						error: null,
						isAuthenticated: false, // User is not authenticated
						user: null,
						isCheckingAuth: false,
					});
					return {
						success: false,
						message: data.message || "Check auth failed",
					};
				}

				// If response is ok and we have a user, set authenticated to true
				set({
					isLoading: false,
					isAuthenticated: true,
					user: data?.user ?? null,
					error: null,
					isCheckingAuth: false,
				});

				return {
					success: true,
					message: "Check auth successful",
				};
			} catch (error) {
				console.error("Check auth error:", error);
				set({
					isLoading: false,
					error: null,
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

		// Logout user
		logout: async () => {
			set({
				isLoading: true,
				error: null,
			});

			try {
				const response = await fetch(`${apiUrl}/auth/logout`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					set({
						isLoading: false,
						error: data.message || "Logout failed",
					});
					return {
						success: false,
						message: data.message || "Logout failed",
					};
				}

				set({
					isLoading: false,
					isAuthenticated: false,
					user: null,
					error: null,
				});

				return {
					success: true,
					message: "Logout successful",
				};
			} catch (error) {
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
	})),

	{
		enabled: env === "development" ? true : false,
	}
);
