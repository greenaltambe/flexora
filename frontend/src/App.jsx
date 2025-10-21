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

const App = () => {
	const { checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<Layout>
			<Routes>
				<Route
					path="/"
					element={<LandingPage />}
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
				<Route
					path="/logout"
					element={
						<Protect>
							<Logout />
						</Protect>
					}
				/>
			</Routes>
			<Toaster position="top-center" />
		</Layout>
	);
};

export default App;
