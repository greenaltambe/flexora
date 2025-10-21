import { useAuthStore } from "../store/auth/authStore";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const Protect = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

	console.log("Protect component - isCheckingAuth:", isCheckingAuth);
	console.log("Protect component - isAuthenticated:", isAuthenticated);
	console.log("Protect component - user:", user);

	if (isCheckingAuth) {
		console.log("Protect: Showing loader");
		return <Loader />;
	}

    if (!isAuthenticated) {
		console.log("Protect: Redirecting to landing page");
		return <Navigate to="/" replace />;
	}

    if (requireAdmin && user?.role !== "admin") {
        console.log("Protect: Non-admin tried to access admin route");
        return <Navigate to="/dashboard" replace />;
    }

	console.log("Protect: Rendering children");
	return children;
};

export default Protect;
