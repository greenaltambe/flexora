import { create } from "zustand";
import { devtools } from "zustand/middleware";

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

const getErrorMessage = (error) => {
if (error && error.message) return error.message;
return String(error) || "Something went wrong";
};

export const useAutoPlanStore = create(
devtools((set) => ({
currentPlan: null,
isLoading: false,
error: null,

generateAutoPlan: async (params) => {
set({ isLoading: true, error: null });
try {
const response = await fetch(`${apiUrl}/auto-plan/generate`, {
method: "POST",
headers: { "Content-Type": "application/json" },
credentials: "include",
body: JSON.stringify(params),
});

const data = await response.json();

if (!response.ok) {
set({ isLoading: false, error: data.message });
return { success: false, message: data.message };
}

set({ currentPlan: data.plan, isLoading: false, error: null });
return { success: true, data: data.plan };
} catch (error) {
set({ isLoading: false, error: getErrorMessage(error) });
return { success: false, message: getErrorMessage(error) };
}
},

getCurrentAutoPlan: async () => {
set({ isLoading: true, error: null });
try {
const response = await fetch(`${apiUrl}/auto-plan/current`, {
method: "GET",
headers: { "Content-Type": "application/json" },
credentials: "include",
});

const data = await response.json();

if (!response.ok) {
set({ isLoading: false, error: data.message });
return { success: false, message: data.message };
}

set({ currentPlan: data.plan, isLoading: false, error: null });
return { success: true, data: data.plan };
} catch (error) {
set({ isLoading: false, error: getErrorMessage(error) });
return { success: false, message: getErrorMessage(error) };
}
},

getAutoPlanById: async (id) => {
set({ isLoading: true, error: null });
try {
const response = await fetch(`${apiUrl}/auto-plan/${id}`, {
method: "GET",
headers: { "Content-Type": "application/json" },
credentials: "include",
});

const data = await response.json();

if (!response.ok) {
set({ isLoading: false, error: data.message });
return { success: false, message: data.message };
}

set({ currentPlan: data.plan, isLoading: false, error: null });
return { success: true, data: data.plan };
} catch (error) {
set({ isLoading: false, error: getErrorMessage(error) });
return { success: false, message: getErrorMessage(error) };
}
},

adjustAutoPlan: async (id, adjustments) => {
set({ isLoading: true, error: null });
try {
const response = await fetch(`${apiUrl}/auto-plan/${id}/adjust`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
credentials: "include",
body: JSON.stringify(adjustments),
});

const data = await response.json();

if (!response.ok) {
set({ isLoading: false, error: data.message });
return { success: false, message: data.message };
}

set({ currentPlan: data.plan, isLoading: false, error: null });
return { success: true, data: data.plan };
} catch (error) {
set({ isLoading: false, error: getErrorMessage(error) });
return { success: false, message: getErrorMessage(error) };
}
},

triggerProgression: async (id, autoApply = false) => {
set({ isLoading: true, error: null });
try {
const response = await fetch(`${apiUrl}/auto-plan/${id}/progress`, {
method: "POST",
headers: { "Content-Type": "application/json" },
credentials: "include",
body: JSON.stringify({ autoApply }),
});

const data = await response.json();

if (!response.ok) {
set({ isLoading: false, error: data.message });
return { success: false, message: data.message };
}

if (data.plan) {
set({ currentPlan: data.plan, isLoading: false, error: null });
} else {
set({ isLoading: false, error: null });
}

return { success: true, data };
} catch (error) {
set({ isLoading: false, error: getErrorMessage(error) });
return { success: false, message: getErrorMessage(error) };
}
},

deactivateAutoPlan: async (id) => {
set({ isLoading: true, error: null });
try {
const response = await fetch(`${apiUrl}/auto-plan/${id}`, {
method: "DELETE",
headers: { "Content-Type": "application/json" },
credentials: "include",
});

const data = await response.json();

if (!response.ok) {
set({ isLoading: false, error: data.message });
return { success: false, message: data.message };
}

set({ currentPlan: null, isLoading: false, error: null });
return { success: true, message: "Plan deactivated" };
} catch (error) {
set({ isLoading: false, error: getErrorMessage(error) });
return { success: false, message: getErrorMessage(error) };
}
},

clearCurrentPlan: () => set({ currentPlan: null }),
})),
{
enabled: env === "development",
}
);
