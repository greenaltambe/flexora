import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import {
	LayoutDashboard,
	ListChecks,
	Calendar,
	User,
} from "lucide-react";

const BottomNav = () => {
	const { user } = useAuthStore();
	const location = useLocation();
	const isAdmin = user?.role === "admin";

	const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

	const navItems = [
		{
			title: "Home",
			icon: <LayoutDashboard className="w-5 h-5" />,
			path: isAdmin ? "/admin" : "/dashboard",
			activeCheck: isAdmin ? "/admin" : "/dashboard",
		},
		{
			title: "Exercises",
			icon: <ListChecks className="w-5 h-5" />,
			path: "/exercises",
			activeCheck: "/exercises",
		},
		{
			title: "Plans",
			icon: <Calendar className="w-5 h-5" />,
			path: "/plans",
			activeCheck: "/plans",
		},
		{
			title: "Profile",
			icon: <User className="w-5 h-5" />,
			path: "/profile/settings",
			activeCheck: "/profile",
		},
	];

	return (
		<div className="btm-nav lg:hidden bg-base-200 border-t border-base-300 z-40">
			{navItems.map((item) => (
				<Link
					key={item.path}
					to={item.path}
					className={isActive(item.activeCheck) ? "active" : ""}
				>
					{item.icon}
					<span className="btm-nav-label text-xs">{item.title}</span>
				</Link>
			))}
		</div>
	);
};

export default BottomNav;
