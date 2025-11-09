import Logout from "../pages/Logout";
import { useAuthStore } from "../store/auth/authStore";
import { Link } from "react-router-dom";
import { Dumbbell, Home, BarChart3 } from "lucide-react";
import ThemeChanger from "./ThemeChanger";

const Navbar = () => {
	const { isAuthenticated, user } = useAuthStore();
	return (
		<div>
			<div className="navbar bg-base-100 shadow-sm">
				<div className="navbar-start">
					<div className="dropdown">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost lg:hidden"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h8m-8 6h16"
								/>
							</svg>
						</div>
						<ul
							tabIndex="-1"
							className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
						>
							{isAuthenticated ? (
								<>
									<li>
										<Link
											to="/dashboard"
											className="flex items-center gap-2"
										>
											<BarChart3 className="w-4 h-4" />
											Dashboard
										</Link>
									</li>
									<li>
										<Logout />
									</li>
								</>
							) : (
								<>
									<li>
										<Link
											to="/"
											className="flex items-center gap-2"
										>
											<Home className="w-4 h-4" />
											Home
										</Link>
									</li>
									<li>
										<Link to="/login">Login</Link>
									</li>
									<li>
										<Link to="/register">Register</Link>
									</li>
								</>
							)}
						</ul>
					</div>
					<Link
						to={isAuthenticated ? "/dashboard" : "/"}
						className="btn btn-ghost text-xl flex items-center gap-2"
					>
						<Dumbbell className="w-6 h-6 text-primary" />
						Flexora
					</Link>
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal px-1">
						{isAuthenticated ? (
							<>
								<li>
									<Link
										to={
											user?.role === "admin"
												? "/admin"
												: "/dashboard"
										}
										className="flex items-center gap-2"
									>
										<BarChart3 className="w-4 h-4" />
										{user?.role === "admin"
											? "Admin"
											: "Dashboard"}
									</Link>
								</li>
							</>
						) : (
							<>
								<li>
									<Link
										to="/"
										className="flex items-center gap-2"
									>
										<Home className="w-4 h-4" />
										Home
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
				{isAuthenticated ? (
					<div className="navbar-end">
						<div className="flex items-center gap-4">
							<ThemeChanger position="navbar" />
							<span className="text-sm text-base-content/70">
								Welcome, {user?.firstName}
							</span>
							<Logout />
						</div>
					</div>
				) : (
					<div className="navbar-end">
						<div className="flex items-center gap-2">
							<ThemeChanger position="navbar" />
							<Link to="/login" className="btn btn-ghost">
								Login
							</Link>
							<Link to="/register" className="btn btn-primary">
								Get Started
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
