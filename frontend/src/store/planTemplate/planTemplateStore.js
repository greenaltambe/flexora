import { create } from "zustand";
import { devtools } from "zustand/middleware";

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

const getErrorMessage = (error) => {
	if (error && error.message) return error.message;
	return String(error) || "Something went wrong";
};

export const usePlanTemplateStore = create(
	devtools((set) => ({
		templates: [],
		currentTemplate: null,
		isLoading: false,
		error: null,

		getPlanTemplates: async (filters = {}) => {
			set({ isLoading: true, error: null });
			try {
				const params = new URLSearchParams();
				Object.keys(filters).forEach((key) => {
					if (filters[key]) params.append(key, filters[key]);
				});

				const response = await fetch(
					`${apiUrl}/plan-templates/?${params.toString()}`,
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
					templates: data.templates || [],
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.templates };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		getPlanTemplateById: async (id) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/plan-templates/${id}`, {
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
					currentTemplate: data.planTemplate,
					isLoading: false,
					error: null,
				});

				return { success: true, data: data.planTemplate };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		createPlanTemplate: async (templateData) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/plan-templates/`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify(templateData),
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({ isLoading: false, error: null });
				return { success: true, data: data.planTemplate };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		updatePlanTemplate: async (id, templateData) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/plan-templates/${id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify(templateData),
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set({ isLoading: false, error: null });
				return { success: true, data: data.planTemplate };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		deletePlanTemplate: async (id) => {
			set({ isLoading: true, error: null });
			try {
				const response = await fetch(`${apiUrl}/plan-templates/${id}`, {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					set({ isLoading: false, error: data.message });
					return { success: false, message: data.message };
				}

				set((state) => ({
					templates: state.templates.filter((t) => t._id !== id),
					isLoading: false,
					error: null,
				}));

				return { success: true, message: "Template deleted" };
			} catch (error) {
				set({ isLoading: false, error: getErrorMessage(error) });
				return { success: false, message: getErrorMessage(error) };
			}
		},

		clearCurrentTemplate: () => set({ currentTemplate: null }),
	})),
	{
		enabled: env === "development",
	}
);
