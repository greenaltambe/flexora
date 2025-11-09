import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import {
	Dumbbell,
	LayoutDashboard,
	ListChecks,
	Calendar,
	User,
	LogOut,
	Settings,
	Plus,
	Upload,
	FolderKanban,
	Zap,
	Apple,
} from "lucide-react";
import ThemeChanger from "./ThemeChanger";

const Sidebar = ({ isOpen, onClose }) => {
	const { user, logout } = useAuthStore();
	const location = useLocation();
	const isAdmin = user?.role === "admin";

	const isActive = (path) => location.pathname === path;

	const handleLogout = async () => {
		await logout();
		onClose?.();
	};

	const menuItems = isAdmin
		? [
				{
					title: "Admin Dashboard",
					icon: <LayoutDashboard className="w-5 h-5" />,
					path: "/admin",
				},
				{ divider: true, label: "Exercises" },
				{
					title: "Manage Exercises",
					icon: <Settings className="w-5 h-5" />,
					path: "/admin/manage-exercise",
				},
				{
					title: "Create Exercise",
					icon: <Plus className="w-5 h-5" />,
					path: "/admin/exercises/create",
				},
				{
					title: "Import CSV",
					icon: <Upload className="w-5 h-5" />,
					path: "/admin/exercises/import-csv",
				},
				{ divider: true, label: "Plans" },
				{
					title: "Browse Plans",
					icon: <Calendar className="w-5 h-5" />,
					path: "/plans",
				},
				{
					title: "Manage Templates",
					icon: <FolderKanban className="w-5 h-5" />,
					path: "/admin/plan-templates",
				},
				{
					title: "Create Template",
					icon: <Plus className="w-5 h-5" />,
					path: "/admin/plan-templates/create",
				},
				{ divider: true, label: "Profile" },
				{
					title: "Settings",
					icon: <User className="w-5 h-5" />,
					path: "/profile/settings",
				},
		  ]
		: [
				{
					title: "Dashboard",
					icon: <LayoutDashboard className="w-5 h-5" />,
					path: "/dashboard",
				},
				{ divider: true, label: "Workout" },
				{
					title: "Today's Workout",
					icon: <Zap className="w-5 h-5" />,
					path: "/today-workout",
				},
				{ divider: true, label: "Plans" },
				{
					title: "Browse Plans",
					icon: <Calendar className="w-5 h-5" />,
					path: "/plans",
				},
				{
					title: "Generate Custom Plan",
					icon: <Zap className="w-5 h-5" />,
					path: "/generate-plan",
				},
				{
					title: "My Plans",
					icon: <FolderKanban className="w-5 h-5" />,
					path: "/my-plans",
				},
				{ divider: true, label: "Nutrition" },
				{
					title: "Diet & Nutrition",
					icon: <Apple className="w-5 h-5" />,
					path: "/diet",
				},
				{ divider: true, label: "Profile" },
				{
					title: "Settings",
					icon: <User className="w-5 h-5" />,
					path: "/profile/settings",
				},
		  ];

	return (
		<div
			className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-base-200 shadow-lg z-50 flex flex-col transition-transform duration-300 ${
				isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
			}`}
		>
			{/* Logo */}
			<div className="p-4 border-b border-base-300">
				<Link
					to={isAdmin ? "/admin" : "/dashboard"}
					className="flex items-center gap-2 text-xl font-bold"
					onClick={onClose}
				>
					<Dumbbell className="w-6 h-6 text-primary" />
					<span>Flexora</span>
				</Link>
			</div>

			{/* Navigation Menu */}
			<nav className="flex-1 overflow-y-auto p-4">
				<ul className="menu menu-sm gap-1">
					{menuItems.map((item, index) => {
						if (item.divider) {
							return (
								<li
									key={`divider-${index}`}
									className="menu-title mt-4"
								>
									{item.label}
								</li>
							);
						}
						return (
							<li key={item.path}>
								<Link
									to={item.path}
									className={`flex items-center gap-3 ${
										isActive(item.path) ? "active" : ""
									}`}
									onClick={onClose}
								>
									{item.icon}
									<span>{item.title}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* User Section */}
			<div className="p-4 border-t border-base-300">
				<div className="flex items-center gap-3 mb-4">
					<div className="avatar placeholder">
						<div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
							<span className="text-sm font-semibold">
								{user?.firstName?.[0]}
								{user?.lastName?.[0]}
							</span>
						</div>
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium truncate">
							{user?.firstName} {user?.lastName}
						</p>
						<p className="text-xs text-base-content/60 truncate">
							{user?.email}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<ThemeChanger />
					<button
						onClick={handleLogout}
						className="btn btn-sm btn-ghost flex-1 gap-2"
					>
						<LogOut className="w-4 h-4" />
						Logout
					</button>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
