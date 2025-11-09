import { useState } from "react";
import { useAuthStore } from "../store/auth/authStore";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Menu } from "lucide-react";

const Layout = ({ children }) => {
	const { isAuthenticated } = useAuthStore();
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Public routes that don't need sidebar
	const publicRoutes = ["/", "/login", "/register", "/verify-email", "/forgot-password"];
	const isPublicRoute = publicRoutes.includes(location.pathname) || 
		location.pathname.startsWith("/reset-password");

	// Show old navbar for public routes
	if (isPublicRoute || !isAuthenticated) {
		return (
			<div className="min-h-screen">
				<Navbar />
				{children}
				<Footer />
			</div>
		);
	}

	// Authenticated layout with sidebar
	return (
		<div className="min-h-screen flex">
			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-h-screen">
				{/* Mobile Header with Hamburger */}
				<div className="lg:hidden sticky top-0 z-30 bg-base-100 shadow-sm">
					<div className="flex items-center gap-3 p-4">
						<button
							onClick={() => setSidebarOpen(true)}
							className="btn btn-ghost btn-sm"
							aria-label="Open menu"
						>
							<Menu className="w-5 h-5" />
						</button>
						<h1 className="text-lg font-semibold">Flexora</h1>
					</div>
				</div>

				{/* Page Content */}
				<main className="flex-1 pb-20 lg:pb-6">
					{children}
				</main>

				{/* Footer - hidden on mobile due to bottom nav */}
				<div className="hidden lg:block">
					<Footer />
				</div>
			</div>

			{/* Bottom Navigation (Mobile Only) */}
			<BottomNav />
		</div>
	);
};

export default Layout;
