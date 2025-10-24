import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Calendar, TrendingUp, Target, Clock, Award, Settings } from "lucide-react";
import { useAuthStore } from "../store/auth/authStore";

const Dashboard = () => {
	const { user, isCheckingAuth } = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isCheckingAuth && user && !user.onboardingCompleted) {
			navigate("/onboarding");
		}
	}, [user, isCheckingAuth, navigate]);

	return (
		<div className="min-h-screen bg-base-200 p-4">
			<div className="container mx-auto">
				{/* Welcome Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold mb-2">
						Welcome back, {user?.firstName}! 👋
					</h1>
					<p className="text-lg text-base-content/70">
						Ready to crush your fitness goals today?
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="stat bg-base-100 shadow-lg rounded-lg">
						<div className="stat-figure text-primary">
							<Dumbbell className="w-8 h-8" />
						</div>
						<div className="stat-title">Workouts This Week</div>
						<div className="stat-value text-primary">3</div>
						<div className="stat-desc">2 more to reach your goal</div>
					</div>

					<div className="stat bg-base-100 shadow-lg rounded-lg">
						<div className="stat-figure text-secondary">
							<Clock className="w-8 h-8" />
						</div>
						<div className="stat-title">Total Time</div>
						<div className="stat-value text-secondary">2h 30m</div>
						<div className="stat-desc">This week</div>
					</div>

					<div className="stat bg-base-100 shadow-lg rounded-lg">
						<div className="stat-figure text-accent">
							<Target className="w-8 h-8" />
						</div>
						<div className="stat-title">Goals Achieved</div>
						<div className="stat-value text-accent">12</div>
						<div className="stat-desc">This month</div>
					</div>

					<div className="stat bg-base-100 shadow-lg rounded-lg">
						<div className="stat-figure text-success">
							<TrendingUp className="w-8 h-8" />
						</div>
						<div className="stat-title">Streak</div>
						<div className="stat-value text-success">7</div>
						<div className="stat-desc">Days in a row</div>
					</div>
				</div>

				{/* Main Content Grid */}
				<div className="grid lg:grid-cols-3 gap-6">
					{/* Today's Workout */}
					<div className="lg:col-span-2">
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h2 className="card-title mb-4">
									<Calendar className="w-6 h-6" />
									Today's Workout
								</h2>
								<div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg mb-4">
									<h3 className="text-2xl font-bold mb-2">Upper Body Strength</h3>
									<p className="text-base-content/70 mb-4">
										Focus on building upper body strength with compound movements
									</p>
									<div className="flex gap-4 text-sm">
										<span className="badge badge-primary">45 min</span>
										<span className="badge badge-secondary">Intermediate</span>
										<span className="badge badge-accent">Strength</span>
									</div>
								</div>
								<div className="space-y-3">
									<div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
										<span className="font-medium">Push-ups</span>
										<span className="text-primary font-bold">3 x 12</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
										<span className="font-medium">Pull-ups</span>
										<span className="text-primary font-bold">3 x 8</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
										<span className="font-medium">Dumbbell Press</span>
										<span className="text-primary font-bold">3 x 10</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
										<span className="font-medium">Rows</span>
										<span className="text-primary font-bold">3 x 12</span>
									</div>
								</div>
								<div className="card-actions justify-end mt-4">
									<button className="btn btn-primary">
										Start Workout
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Quick Actions */}
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h3 className="card-title text-lg mb-4">Quick Actions</h3>
								<div className="space-y-2">
									<button className="btn btn-outline w-full justify-start">
										<Dumbbell className="w-4 h-4" />
										Start Workout
									</button>
									<button className="btn btn-outline w-full justify-start">
										<Target className="w-4 h-4" />
										Set New Goal
									</button>
									<button className="btn btn-outline w-full justify-start">
										<TrendingUp className="w-4 h-4" />
										View Progress
									</button>
									<button 
										className="btn btn-outline w-full justify-start"
										onClick={() => navigate("/onboarding")}
									>
										<Settings className="w-4 h-4" />
										Update Profile
									</button>
								</div>
							</div>
						</div>

						{/* Recent Achievements */}
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h3 className="card-title text-lg mb-4">
									<Award className="w-5 h-5" />
									Recent Achievements
								</h3>
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<div className="badge badge-primary badge-sm">🏆</div>
										<div>
											<p className="font-medium text-sm">First Week Complete</p>
											<p className="text-xs text-base-content/70">2 days ago</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="badge badge-secondary badge-sm">💪</div>
										<div>
											<p className="font-medium text-sm">Strength Milestone</p>
											<p className="text-xs text-base-content/70">5 days ago</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="badge badge-accent badge-sm">🔥</div>
										<div>
											<p className="font-medium text-sm">7-Day Streak</p>
											<p className="text-xs text-base-content/70">1 week ago</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Weekly Progress */}
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h3 className="card-title text-lg mb-4">Weekly Progress</h3>
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Monday</span>
										<div className="flex gap-1">
											<div className="w-3 h-3 bg-primary rounded-full"></div>
											<div className="w-3 h-3 bg-primary rounded-full"></div>
											<div className="w-3 h-3 bg-base-300 rounded-full"></div>
										</div>
									</div>
									<div className="flex justify-between text-sm">
										<span>Tuesday</span>
										<div className="flex gap-1">
											<div className="w-3 h-3 bg-primary rounded-full"></div>
											<div className="w-3 h-3 bg-primary rounded-full"></div>
											<div className="w-3 h-3 bg-primary rounded-full"></div>
										</div>
									</div>
									<div className="flex justify-between text-sm">
										<span>Wednesday</span>
										<div className="flex gap-1">
											<div className="w-3 h-3 bg-primary rounded-full"></div>
											<div className="w-3 h-3 bg-base-300 rounded-full"></div>
											<div className="w-3 h-3 bg-base-300 rounded-full"></div>
										</div>
									</div>
									<div className="flex justify-between text-sm">
										<span>Today</span>
										<div className="flex gap-1">
											<div className="w-3 h-3 bg-primary rounded-full"></div>
											<div className="w-3 h-3 bg-base-300 rounded-full"></div>
											<div className="w-3 h-3 bg-base-300 rounded-full"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
