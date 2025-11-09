import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Dumbbell,
	Calendar,
	TrendingUp,
	Target,
	Clock,
	Award,
	Settings,
	Play,
	Timer,
	Trophy,
} from "lucide-react";
import { useAuthStore } from "../store/auth/authStore";
import { useStreakStore } from "../store/streak/streakStore";
import { useDailySessionStore } from "../store/dailySession/dailySessionStore";
import StreakCounter from "../components/streak/StreakCounter";

const Dashboard = () => {
	const { user, isCheckingAuth } = useAuthStore();
	const {
		streak,
		isLoading: streakLoading,
		getStreak,
		getMilestones,
		getWeeklyConsistency,
	} = useStreakStore();
	const {
		todaySession,
		isLoading: sessionLoading,
		getTodaySession,
	} = useDailySessionStore();
	const navigate = useNavigate();
	const [milestones, setMilestones] = useState([]);
	const [weeklyConsistency, setWeeklyConsistency] = useState(null);

	useEffect(() => {
		if (!isCheckingAuth && user && !user.onboardingCompleted) {
			navigate("/onboarding");
		}
	}, [user, isCheckingAuth, navigate]);

	useEffect(() => {
		// Load all dashboard data on mount
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		await getStreak();
		await getTodaySession();

		// Load milestones
		const milestonesResult = await getMilestones();
		if (milestonesResult.success) {
			setMilestones(milestonesResult.data || []);
		}

		// Load weekly consistency
		const consistencyResult = await getWeeklyConsistency();
		if (consistencyResult.success) {
			setWeeklyConsistency(consistencyResult.data);
		}
	};

	const formatDuration = (minutes) => {
		if (!minutes) return "N/A";
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	};

	const getDayName = (index) => {
		const days = [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		];
		return days[index] || "Day";
	};

	const handleStartWorkout = () => {
		if (
			todaySession &&
			todaySession.exercises &&
			todaySession.exercises.length > 0
		) {
			navigate("/log-workout");
		} else {
			navigate("/today-workout");
		}
	};

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

				{/* Streak Widget */}
				<div className="mb-8">
					<StreakCounter
						streak={streak}
						isLoading={streakLoading}
						showDetails={true}
					/>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="stat bg-base-100 shadow-lg rounded-lg">
						<div className="stat-figure text-primary">
							<Dumbbell className="w-8 h-8" />
						</div>
						<div className="stat-title">Workouts This Week</div>
						<div className="stat-value text-primary">
							{weeklyConsistency?.completedDays || 0}
						</div>
						<div className="stat-desc">
							{weeklyConsistency?.totalDays
								? `${
										weeklyConsistency.totalDays -
										weeklyConsistency.completedDays
								  } more days this week`
								: "Keep going!"}
						</div>
					</div>

					<div className="stat bg-base-100 shadow-lg rounded-lg">
						<div className="stat-figure text-secondary">
							<Clock className="w-8 h-8" />
						</div>
						<div className="stat-title">Total Time</div>
						<div className="stat-value text-secondary">
							{formatDuration(weeklyConsistency?.totalMinutes)}
						</div>
						<div className="stat-desc">This week</div>
					</div>

					<div className="stat bg-base-100 shadow-lg rounded-lg">
						<div className="stat-figure text-accent">
							<Target className="w-8 h-8" />
						</div>
						<div className="stat-title">Total Workouts</div>
						<div className="stat-value text-accent">
							{streak?.totalWorkouts || 0}
						</div>
						<div className="stat-desc">All time</div>
					</div>

					<div className="stat bg-base-100 shadow-lg rounded-lg">
						<div className="stat-figure text-success">
							<TrendingUp className="w-8 h-8" />
						</div>
						<div className="stat-title">Current Streak</div>
						<div className="stat-value text-success">
							{streak?.currentStreak || 0}
						</div>
						<div className="stat-desc">
							Best: {streak?.longestStreak || 0} days
						</div>
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

								{sessionLoading ? (
									<div className="flex justify-center py-12">
										<span className="loading loading-spinner loading-lg"></span>
									</div>
								) : !todaySession ||
								  !todaySession.exercises ||
								  todaySession.exercises.length === 0 ? (
									<div className="text-center py-8">
										<Dumbbell className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
										<h3 className="text-xl font-bold mb-2">
											No Workout Today
										</h3>
										<p className="text-base-content/70 mb-4">
											You don't have a workout scheduled
											for today
										</p>
										<button
											className="btn btn-primary"
											onClick={() => navigate("/plans")}
										>
											Browse Plans
										</button>
									</div>
								) : (
									<>
										<div className="bg-linear-to-r from-primary/10 to-secondary/10 p-6 rounded-lg mb-4">
											<h3 className="text-2xl font-bold mb-2">
												{todaySession.name ||
													"Today's Session"}
											</h3>
											<p className="text-base-content/70 mb-4">
												{todaySession.description ||
													"Complete your workout for today"}
											</p>
											<div className="flex gap-4 text-sm flex-wrap">
												<span className="badge badge-primary gap-2">
													<Clock className="w-3 h-3" />
													{todaySession.estimatedDuration
														? `${todaySession.estimatedDuration} min`
														: "Est. time"}
												</span>
												{todaySession.difficulty && (
													<span className="badge badge-secondary">
														{
															todaySession.difficulty
														}
													</span>
												)}
												{todaySession.focusArea && (
													<span className="badge badge-accent">
														{todaySession.focusArea}
													</span>
												)}
											</div>
										</div>
										<div className="space-y-3 max-h-[400px] overflow-y-auto">
											{todaySession.exercises
												.slice(0, 5)
												.map((exercise, index) => {
													const exerciseData =
														exercise.exercise ||
														exercise;
													return (
														<div
															key={index}
															className="flex justify-between items-center p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
														>
															<div className="flex-1">
																<span className="font-medium block">
																	{exerciseData.name ||
																		"Exercise"}
																</span>
																{exerciseData.type ===
																	"timed" && (
																	<span className="text-xs text-base-content/60 flex items-center gap-1 mt-1">
																		<Timer className="w-3 h-3" />
																		Timed
																		exercise
																	</span>
																)}
															</div>
															<span className="text-primary font-bold">
																{exercise.sets &&
																exercise.reps
																	? `${exercise.sets} x ${exercise.reps}`
																	: exercise.duration
																	? `${exercise.duration}s`
																	: "See details"}
															</span>
														</div>
													);
												})}
											{todaySession.exercises.length >
												5 && (
												<div className="text-center text-sm text-base-content/60 py-2">
													+{" "}
													{todaySession.exercises
														.length - 5}{" "}
													more exercises
												</div>
											)}
										</div>
										<div className="card-actions justify-end mt-4">
											<button
												className="btn btn-primary gap-2"
												onClick={handleStartWorkout}
											>
												<Play className="w-4 h-4" />
												Start Workout
											</button>
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Quick Actions */}
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h3 className="card-title text-lg mb-4">
									Quick Actions
								</h3>
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
								{streakLoading ? (
									<div className="flex justify-center py-4">
										<span className="loading loading-spinner loading-sm"></span>
									</div>
								) : milestones.length === 0 ? (
									<div className="text-center py-4">
										<Trophy className="w-8 h-8 mx-auto text-base-content/30 mb-2" />
										<p className="text-xs text-base-content/70">
											Complete workouts to earn
											achievements
										</p>
									</div>
								) : (
									<>
										<div className="space-y-3">
											{milestones
												.slice(0, 3)
												.map((milestone, index) => {
													const getBadgeEmoji = (
														type
													) => {
														switch (type) {
															case "streak_milestone":
																return "🔥";
															case "workout_count":
																return "💪";
															case "total_minutes":
																return "⏱️";
															default:
																return "🏆";
														}
													};

													const getBadgeColor = (
														type
													) => {
														switch (type) {
															case "streak_milestone":
																return "badge-primary";
															case "workout_count":
																return "badge-secondary";
															case "total_minutes":
																return "badge-accent";
															default:
																return "badge-ghost";
														}
													};

													const getMilestoneTitle = (
														type,
														value
													) => {
														switch (type) {
															case "streak_milestone":
																return `${value}-Day Streak`;
															case "workout_count":
																return `${value} Workouts`;
															case "total_minutes":
																return `${value} Minutes`;
															default:
																return `Milestone Reached`;
														}
													};

													const getTimeAgo = (
														date
													) => {
														const days = Math.floor(
															(Date.now() -
																new Date(
																	date
																)) /
																(1000 *
																	60 *
																	60 *
																	24)
														);
														if (days === 0)
															return "Today";
														if (days === 1)
															return "1 day ago";
														if (days < 7)
															return `${days} days ago`;
														const weeks =
															Math.floor(
																days / 7
															);
														if (weeks === 1)
															return "1 week ago";
														return `${weeks} weeks ago`;
													};

													return (
														<div
															key={index}
															className="flex items-center gap-3"
														>
															<div
																className={`badge ${getBadgeColor(
																	milestone.type
																)} badge-sm`}
															>
																{getBadgeEmoji(
																	milestone.type
																)}
															</div>
															<div>
																<p className="font-medium text-sm">
																	{getMilestoneTitle(
																		milestone.type,
																		milestone.value
																	)}
																</p>
																<p className="text-xs text-base-content/70">
																	{getTimeAgo(
																		milestone.earnedAt
																	)}
																</p>
															</div>
														</div>
													);
												})}
										</div>
										{milestones.length > 3 && (
											<button
												className="btn btn-ghost btn-xs w-full mt-3"
												onClick={() =>
													navigate(
														"/streak-dashboard"
													)
												}
											>
												View All ({milestones.length})
											</button>
										)}
									</>
								)}
							</div>
						</div>

						{/* Weekly Progress */}
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h3 className="card-title text-lg mb-4">
									Weekly Progress
								</h3>
								{streakLoading ? (
									<div className="flex justify-center py-4">
										<span className="loading loading-spinner loading-sm"></span>
									</div>
								) : !weeklyConsistency ||
								  !weeklyConsistency.days ? (
									<div className="text-center py-4">
										<p className="text-xs text-base-content/70">
											No weekly data available
										</p>
									</div>
								) : (
									<div className="space-y-2">
										{weeklyConsistency.days.map((day) => {
											const dayName = getDayName(
												day.dayOfWeek
											);
											const isToday =
												day.dayOfWeek ===
												new Date().getDay();
											const completed =
												day.completed || false;
											const exerciseCount =
												day.exercises || 0;

											return (
												<div
													key={day.dayOfWeek}
													className="flex justify-between items-center text-sm"
												>
													<span
														className={
															isToday
																? "font-bold text-primary"
																: ""
														}
													>
														{isToday
															? "Today"
															: dayName}
													</span>
													<div className="flex items-center gap-2">
														{exerciseCount > 0 && (
															<span className="text-xs text-base-content/60">
																{exerciseCount}{" "}
																exercises
															</span>
														)}
														<div className="flex gap-1">
															{completed ? (
																<>
																	<div className="w-3 h-3 bg-primary rounded-full"></div>
																	<div className="w-3 h-3 bg-primary rounded-full"></div>
																	<div className="w-3 h-3 bg-primary rounded-full"></div>
																</>
															) : (
																<>
																	<div className="w-3 h-3 bg-base-300 rounded-full"></div>
																	<div className="w-3 h-3 bg-base-300 rounded-full"></div>
																	<div className="w-3 h-3 bg-base-300 rounded-full"></div>
																</>
															)}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
								{weeklyConsistency &&
									weeklyConsistency.completedDays > 0 && (
										<div className="mt-4 pt-4 border-t border-base-300">
											<div className="text-center">
												<p className="text-xs text-base-content/70 mb-1">
													Weekly Progress
												</p>
												<p className="text-lg font-bold text-primary">
													{
														weeklyConsistency.completedDays
													}{" "}
													/{" "}
													{
														weeklyConsistency.totalDays
													}{" "}
													days
												</p>
												<div className="w-full bg-base-300 rounded-full h-2 mt-2">
													<div
														className="bg-primary h-2 rounded-full transition-all"
														style={{
															width: `${
																(weeklyConsistency.completedDays /
																	weeklyConsistency.totalDays) *
																100
															}%`,
														}}
													></div>
												</div>
											</div>
										</div>
									)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
