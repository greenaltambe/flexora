import { useEffect, useState } from "react";
import {
	ShieldCheck,
	Users,
	ClipboardList,
	Calendar,
	Plus,
	FolderKanban,
	Upload,
	Settings,
	TrendingUp,
} from "lucide-react";
import { useAuthStore } from "../store/auth/authStore";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../config/axios";

const AdminDashboard = () => {
	const { user } = useAuthStore();
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		userCount: 0,
		exerciseCount: 0,
		templateCount: 0,
		newUsersThisWeek: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		try {
			// Fetch user stats
			const userResponse = await api.get("/profile/users");
			const users = userResponse.data.users || [];

			// Calculate new users this week
			const oneWeekAgo = new Date();
			oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
			const newUsers = users.filter(
				(u) => new Date(u.createdAt) > oneWeekAgo
			).length;

			setStats({
				userCount: users.length,
				exerciseCount: 0, // TODO: Fetch from exercises API
				templateCount: 0, // TODO: Fetch from templates API
				newUsersThisWeek: newUsers,
			});
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<PageContainer>
				<div className="flex justify-center items-center min-h-[400px]">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			</PageContainer>
		);
	}

	return (
		<PageContainer maxWidth="full">
			<div className="flex flex-col gap-6">
				{/* Header */}
				<div>
					<h1 className="text-4xl font-bold flex items-center gap-3">
						<ShieldCheck className="w-8 h-8 text-primary" />
						Admin Dashboard
					</h1>
					<p className="text-base-content/70 mt-2">
						Welcome, {user?.firstName}. Manage Flexora here.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="stats stats-vertical lg:stats-horizontal shadow-lg w-full">
					<div className="stat">
						<div className="stat-figure text-primary">
							<Users className="w-8 h-8" />
						</div>
						<div className="stat-title">Total Users</div>
						<div className="stat-value text-primary">
							{stats.userCount}
						</div>
						<div className="stat-desc flex items-center gap-1">
							<TrendingUp className="w-4 h-4" />
							{stats.newUsersThisWeek} new this week
						</div>
					</div>

					<div className="stat">
						<div className="stat-figure text-secondary">
							<ClipboardList className="w-8 h-8" />
						</div>
						<div className="stat-title">Exercises</div>
						<div className="stat-value text-secondary">
							{stats.exerciseCount}
						</div>
						<div className="stat-desc">In exercise library</div>
					</div>

					<div className="stat">
						<div className="stat-figure text-accent">
							<Calendar className="w-8 h-8" />
						</div>
						<div className="stat-title">Plan Templates</div>
						<div className="stat-value text-accent">
							{stats.templateCount}
						</div>
						<div className="stat-desc">Available templates</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div>
					<h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<button
							className="btn btn-lg btn-primary justify-start gap-3 h-auto py-4"
							onClick={() => navigate("/admin/exercises/create")}
						>
							<Plus className="w-6 h-6" />
							<div className="text-left">
								<div className="text-sm font-normal opacity-80">
									Create New
								</div>
								<div className="text-base font-semibold">
									Exercise
								</div>
							</div>
						</button>

						<button
							className="btn btn-lg btn-secondary justify-start gap-3 h-auto py-4"
							onClick={() =>
								navigate("/admin/plan-templates/create")
							}
						>
							<FolderKanban className="w-6 h-6" />
							<div className="text-left">
								<div className="text-sm font-normal opacity-80">
									Create New
								</div>
								<div className="text-base font-semibold">
									Plan Template
								</div>
							</div>
						</button>

						<button
							className="btn btn-lg btn-accent justify-start gap-3 h-auto py-4"
							onClick={() =>
								navigate("/admin/exercises/import-csv")
							}
						>
							<Upload className="w-6 h-6" />
							<div className="text-left">
								<div className="text-sm font-normal opacity-80">
									Import
								</div>
								<div className="text-base font-semibold">
									CSV Data
								</div>
							</div>
						</button>

						<button
							className="btn btn-lg btn-neutral justify-start gap-3 h-auto py-4"
							onClick={() => navigate("/admin/manage-exercise")}
						>
							<Settings className="w-6 h-6" />
							<div className="text-left">
								<div className="text-sm font-normal opacity-80">
									Manage
								</div>
								<div className="text-base font-semibold">
									Exercises
								</div>
							</div>
						</button>
					</div>
				</div>

				{/* Recent Activity Section (placeholder) */}
				<div className="card bg-base-100 shadow-lg">
					<div className="card-body">
						<h2 className="card-title">Recent Activity</h2>
						<div className="divider my-2"></div>
						<div className="text-center py-8 text-base-content/70">
							<p>Activity timeline coming soon...</p>
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
};

export default AdminDashboard;
