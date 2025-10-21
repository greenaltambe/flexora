import { useAuthStore } from "../store/auth/authStore";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const Protect = ({ children }) => {
	const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

	console.log("Protect component - isCheckingAuth:", isCheckingAuth);
	console.log("Protect component - isAuthenticated:", isAuthenticated);
	console.log("Protect component - user:", user);

	if (isCheckingAuth) {
		console.log("Protect: Showing loader");
		return <Loader />;
	}

	if (!isAuthenticated) {
		console.log("Protect: Redirecting to login");
		return <Navigate to="/login" replace />;
	}

	console.log("Protect: Rendering children");
	return children;
};

export default Protect;
