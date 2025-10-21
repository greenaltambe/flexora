import { useAuthStore } from "../store/auth/authStore";
import { Navigate } from "react-router-dom";

const Protect = ({ children }) => {
	const { isAuthenticated } = useAuthStore();
	if (!isAuthenticated) return <Navigate to="/login" replace />;
	return children;
};

export default Protect;
