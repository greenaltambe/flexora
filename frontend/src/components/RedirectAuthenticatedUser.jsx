// RedirectAuthenticatedUser.jsx
import { useAuthStore } from "../store/auth/authStore";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

	console.log("RedirectAuthenticatedUser - isCheckingAuth:", isCheckingAuth);
	console.log(
		"RedirectAuthenticatedUser - isAuthenticated:",
		isAuthenticated
	);
	console.log("RedirectAuthenticatedUser - user:", user);

	if (isCheckingAuth) {
		console.log("RedirectAuthenticatedUser: Showing loader");
		return <Loader />;
	}

	if (isAuthenticated && user?.isVerified) {
		console.log("RedirectAuthenticatedUser: Redirecting to role dashboard");
		return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />;
	}

	console.log("RedirectAuthenticatedUser: Rendering children");
	return children;
};

export default RedirectAuthenticatedUser;
