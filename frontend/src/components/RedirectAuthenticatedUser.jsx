import { useAuthStore } from "../store/auth/authStore";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) return <Loader />;

	if (isAuthenticated) {
		if (!user?.isVerified) {
			return <Navigate to="/verify-email" replace />;
		}
		return <Navigate to="/" replace />;
	}

	return children;
};

export default RedirectAuthenticatedUser;
