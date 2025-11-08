import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./pages/Layout";
import EmailVerificationPage from "./components/EmailVerificationPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/auth/authStore";
import { useEffect } from "react";
import RedirectAuthenticatedUser from "./components/RedirectAuthenticatedUser";
import Protect from "./components/Protect";
import Logout from "./pages/Logout";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageExercise from "./pages/ManageExercise";
import CreateEditExercise from "./pages/CreateEditExercise";
import ImportExerciseCSV from "./pages/ImportExerciseCSV";
import Onboarding from "./pages/Onboarding";
import ExerciseList from "./pages/ExerciseList";
import ExerciseDetail from "./pages/ExerciseDetail";
import PlanTemplateList from "./pages/PlanTemplateList";
import PlanTemplateDetail from "./pages/PlanTemplateDetail";
import ManagePlanTemplates from "./pages/ManagePlanTemplates";
import CreateEditPlanTemplate from "./pages/CreateEditPlanTemplate";
import ProfileSettings from "./pages/ProfileSettings";
import MyPlans from "./pages/MyPlans";

const App = () => {
	const { checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();

		// Initialize theme from localStorage
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			document.documentElement.setAttribute("data-theme", savedTheme);
		}
	}, [checkAuth]);

	return (
		<Layout>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route
					path="/admin"
					element={
						<Protect requireAdmin>
							<AdminDashboard />
						</Protect>
					}
				/>
				<Route
					path="/admin/manage-exercise"
					element={
						<Protect requireAdmin>
							<ManageExercise />
						</Protect>
					}
				/>
				<Route
					path="/admin/exercises/create"
					element={
						<Protect requireAdmin>
							<CreateEditExercise />
						</Protect>
					}
				/>
				<Route
					path="/admin/exercises/import-csv"
					element={
						<Protect requireAdmin>
							<ImportExerciseCSV />
						</Protect>
					}
				/>
				<Route
					path="/admin/exercises/edit/:id"
					element={
						<Protect requireAdmin>
							<CreateEditExercise />
						</Protect>
					}
				/>
				<Route
					path="/dashboard"
					element={
						<Protect>
							<Dashboard />
						</Protect>
					}
				/>
				<Route
					path="/onboarding"
					element={
						<Protect>
							<Onboarding />
						</Protect>
					}
				/>
				<Route
					path="/login"
					element={
						<RedirectAuthenticatedUser>
							<Login />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path="/register"
					element={
						<RedirectAuthenticatedUser>
							<Register />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path="/verify-email"
					element={
						<RedirectAuthenticatedUser>
							<EmailVerificationPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route
					path="/reset-password/:token"
					element={<ResetPassword />}
				/>
				<Route
					path="/logout"
					element={
						<Protect>
							<Logout />
						</Protect>
					}
				/>
				{/* Exercise Routes */}
				<Route
					path="/exercises"
					element={
						<Protect>
							<ExerciseList />
						</Protect>
					}
				/>
				<Route
					path="/exercises/:id"
					element={
						<Protect>
							<ExerciseDetail />
						</Protect>
					}
				/>
				{/* Plan Routes */}
				<Route
					path="/plans"
					element={
						<Protect>
							<PlanTemplateList />
						</Protect>
					}
				/>
				<Route
					path="/plans/:id"
					element={
						<Protect>
							<PlanTemplateDetail />
						</Protect>
					}
				/>
				<Route
					path="/my-plans"
					element={
						<Protect>
							<MyPlans />
						</Protect>
					}
				/>
				{/* Admin Plan Template Routes */}
				<Route
					path="/admin/plan-templates"
					element={
						<Protect requireAdmin>
							<ManagePlanTemplates />
						</Protect>
					}
				/>
				<Route
					path="/admin/plan-templates/create"
					element={
						<Protect requireAdmin>
							<CreateEditPlanTemplate />
						</Protect>
					}
				/>
				<Route
					path="/admin/plan-templates/edit/:id"
					element={
						<Protect requireAdmin>
							<CreateEditPlanTemplate />
						</Protect>
					}
				/>
				{/* Profile Routes */}
				<Route
					path="/profile/settings"
					element={
						<Protect>
							<ProfileSettings />
						</Protect>
					}
				/>
			</Routes>
			<Toaster position="top-center" />
		</Layout>
	);
};

export default App;
