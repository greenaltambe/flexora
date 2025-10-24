import { useEffect, useState } from "react";
import {
	ShieldCheck,
	Users,
	ClipboardList,
	Settings,
	CheckCircle,
	Clock,
	Edit,
	History,
} from "lucide-react";
import { useAuthStore } from "../store/auth/authStore";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const AdminDashboard = () => {
	const { user } = useAuthStore();
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showUsers, setShowUsers] = useState(false);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await axios.get("/api/profile/users", {
				withCredentials: true,
			});
			setUsers(response.data.users);
		} catch (error) {
			console.error("Failed to fetch users:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleForceCompleteOnboarding = async (userId) => {
		try {
			await axios.patch(
				`/api/profile/users/${userId}/force-onboarding`,
				null,
				{
					withCredentials: true,
				}
			);
			fetchUsers(); // Refresh list
		} catch (error) {
			console.error("Failed to force complete onboarding:", error);
		}
	};

	if (loading) {
		return <Loader />;
	}

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

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h2 className="card-title flex items-center gap-2">
								<Users className="w-5 h-5" /> Users
							</h2>
							<p className="text-sm text-base-content/70">
								View and manage users ({users?.length || 0})
							</p>
							<button
								className="btn btn-primary btn-sm mt-4"
								onClick={() => setShowUsers(!showUsers)}
							>
								{showUsers ? "Hide" : "Show"} Users
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
								onClick={() => navigate("/admin/manage-exercise")}
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

				{/* Users List */}
				{showUsers && (
					<div className="mb-8">
						<h2 className="text-2xl font-bold mb-4">All Users</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{users?.map((u) => (
								<div key={u._id} className="card bg-base-100 shadow-lg">
									<div className="card-body">
										<div className="flex items-start justify-between mb-2">
											<div>
												<h3 className="font-semibold text-lg">
													{u.firstName} {u.lastName}
												</h3>
												<p className="text-sm text-base-content/70">{u.email}</p>
											</div>
											{u.onboardingCompleted ? (
												<div className="badge badge-success gap-1">
													<CheckCircle className="w-3 h-3" />
													Completed
												</div>
											) : (
												<div className="badge badge-warning gap-1">
													<Clock className="w-3 h-3" />
													Pending
												</div>
											)}
										</div>

										{u.profile?.goals && u.profile.goals.length > 0 && (
											<div className="mb-2">
												<p className="text-xs font-medium mb-1">Goals:</p>
												<div className="flex flex-wrap gap-1">
													{u.profile.goals.map((goal) => (
														<span
															key={goal}
															className="badge badge-outline badge-sm"
														>
															{goal.replace("-", " ")}
														</span>
													))}
												</div>
											</div>
										)}

										{u.profile?.equipment && u.profile.equipment.length > 0 && (
											<div className="mb-2">
												<p className="text-xs font-medium mb-1">Equipment:</p>
												<div className="flex flex-wrap gap-1">
													{u.profile.equipment.slice(0, 3).map((eq) => (
														<span
															key={eq}
															className="badge badge-secondary badge-sm"
														>
															{eq}
														</span>
													))}
													{u.profile.equipment.length > 3 && (
														<span className="badge badge-secondary badge-sm">
															+{u.profile.equipment.length - 3}
														</span>
													)}
												</div>
											</div>
										)}

										{u.profile?.days_per_week && (
											<p className="text-xs text-base-content/70 mb-2">
												Training: {u.profile.days_per_week} days/week
											</p>
										)}

										<div className="card-actions justify-end gap-2 mt-3">
											<button
												className="btn btn-xs btn-ghost"
												onClick={() => handleForceCompleteOnboarding(u._id)}
											>
												Force Complete
											</button>
											<button className="btn btn-xs btn-ghost">
												<Edit className="w-3 h-3" />
											</button>
											<button className="btn btn-xs btn-ghost">
												<History className="w-3 h-3" />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="mt-6">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
