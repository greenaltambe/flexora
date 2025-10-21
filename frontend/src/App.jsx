import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./pages/Layout";
import EmailVerificationPage from "./components/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/auth/authStore";
import { useEffect } from "react";
import RedirectAuthenticatedUser from "./components/RedirectAuthenticatedUser";
import Protect from "./components/Protect";

const App = () => {
	const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	console.log(isCheckingAuth, isAuthenticated, user);

	return (
		<Layout>
			<div className="join join-vertical">
				<input
					type="radio"
					name="theme-buttons"
					className="btn theme-controller join-item"
					aria-label="Default"
					value="default"
				/>
				<input
					type="radio"
					name="theme-buttons"
					className="btn theme-controller join-item"
					aria-label="Retro"
					value="retro"
				/>
				<input
					type="radio"
					name="theme-buttons"
					className="btn theme-controller join-item"
					aria-label="Cyberpunk"
					value="cyberpunk"
				/>
				<input
					type="radio"
					name="theme-buttons"
					className="btn theme-controller join-item"
					aria-label="Valentine"
					value="valentine"
				/>
				<input
					type="radio"
					name="theme-buttons"
					className="btn theme-controller join-item"
					aria-label="Aqua"
					value="aqua"
				/>
			</div>
			<Routes>
				<Route
					path="/"
					element={
						<Protect>
							<Home />
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
			</Routes>
			<Toaster position="top-center" />
		</Layout>
	);
};

export default App;
