import { ShieldCheck, Users, ClipboardList, Settings } from "lucide-react";
import { useAuthStore } from "../store/auth/authStore";
import { Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
	const { user } = useAuthStore();
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-base-200 p-4">
			<div className="container mx-auto">
				<h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
					<ShieldCheck className="w-8 h-8 text-primary" /> Admin
					Dashboard
				</h1>
				<p className="text-base-content/70 mb-8">
					Welcome, {user?.firstName}. Manage Flexora here.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h2 className="card-title flex items-center gap-2">
								<Users className="w-5 h-5" /> Users
							</h2>
							<p className="text-sm text-base-content/70">
								View and manage users
							</p>
							<button className="btn btn-primary btn-sm mt-4">
								Open
							</button>
						</div>
					</div>
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h2 className="card-title flex items-center gap-2">
								<ClipboardList className="w-5 h-5" /> Exercises
							</h2>
							<p className="text-sm text-base-content/70">
								Manage exercises
							</p>
							<button
								className="btn btn-primary btn-sm mt-4"
								onClick={() =>
									navigate("/admin/manage-exercise")
								}
							>
								Open
							</button>
						</div>
					</div>
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h2 className="card-title flex items-center gap-2">
								<Settings className="w-5 h-5" /> Settings
							</h2>
							<p className="text-sm text-base-content/70">
								Platform configuration
							</p>
							<button className="btn btn-primary btn-sm mt-4">
								Open
							</button>
						</div>
					</div>
				</div>
				<div className="mt-6">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
