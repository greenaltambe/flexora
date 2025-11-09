import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, Play } from "lucide-react";
import { useDailySessionStore } from "../store/dailySession/dailySessionStore";
import { useStreakStore } from "../store/streak/streakStore";
import PageContainer from "../components/PageContainer";

const TodayWorkout = () => {
	const navigate = useNavigate();
	const { todaySession, isLoading, getTodaySession } = useDailySessionStore();
	const { streak, getStreak } = useStreakStore();

	useEffect(() => {
		getTodaySession();
		getStreak();
	}, []);

	if (isLoading) {
		return (
			<PageContainer>
				<div className="flex justify-center items-center min-h-[400px]">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			</PageContainer>
		);
	}

	if (!todaySession) {
		return (
			<PageContainer>
				<div className="text-center py-12">
					<Calendar className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
					<h2 className="text-2xl font-bold mb-2">
						No Workout Today
					</h2>
					<p className="text-base-content/70 mb-6">
						You don't have a workout scheduled for today.
					</p>
					<Link to="/plans" className="btn btn-primary">
						Browse Plans
					</Link>
				</div>
			</PageContainer>
		);
	}

	return (
		<PageContainer>
			<div className="flex flex-col gap-6">
				{/* Header with Streak */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Today's Workout</h1>
						<p className="text-base-content/70">
							{new Date().toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
						{streak && (
							<div className="flex items-center gap-2 mt-2">
								<span className="badge badge-primary badge-lg">
									🔥 {streak.currentStreak} day streak
								</span>
								<span className="text-sm opacity-70">
									• {streak.totalWorkouts} total workouts
								</span>
							</div>
						)}
					</div>
					<Link
						to="/workout-calendar"
						className="btn btn-outline gap-2"
					>
						<Calendar className="w-4 h-4" />
						View Calendar
					</Link>
				</div>

				{/* Start Workout Button */}
				<div className="card bg-linear-to-r from-primary to-secondary text-primary-content shadow-xl">
					<div className="card-body">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="card-title text-2xl mb-2">
									Ready to crush it?
								</h2>
								<p className="opacity-90">
									{todaySession.exercises?.length || 0}{" "}
									exercises waiting for you
								</p>
							</div>
							<button
								onClick={() => navigate("/log-workout")}
								className="btn btn-lg btn-accent gap-2"
							>
								<Play className="w-5 h-5" />
								Start Workout
							</button>
						</div>
					</div>
				</div>

				{/* Exercises List */}
				<div className="card bg-base-100 shadow-lg">
					<div className="card-body">
						<div className="flex items-center justify-between mb-4">
							<h2 className="card-title">Today's Exercises</h2>
							<Link
								to="/workout-history"
								className="btn btn-ghost btn-sm gap-2"
							>
								View History
							</Link>
						</div>
						<div className="space-y-4">
							{todaySession.exercises?.map((exercise, index) => (
								<div
									key={index}
									className="p-4 bg-base-200 rounded-lg"
								>
									<h3 className="font-semibold text-lg mb-2">
										{exercise.exerciseId?.name ||
											"Exercise"}
									</h3>
									{exercise.planned && (
										<div className="flex flex-wrap gap-2 text-sm">
											{exercise.planned.sets && (
												<span className="badge badge-primary">
													{exercise.planned.sets} sets
												</span>
											)}
											{exercise.planned.reps && (
												<span className="badge badge-secondary">
													{exercise.planned.reps} reps
												</span>
											)}
											{exercise.planned.time_seconds && (
												<span className="badge badge-accent">
													{
														exercise.planned
															.time_seconds
													}
													s
												</span>
											)}
											{exercise.planned.rest_seconds && (
												<span className="badge badge-ghost">
													Rest:{" "}
													{
														exercise.planned
															.rest_seconds
													}
													s
												</span>
											)}
										</div>
									)}
									{exercise.cue && (
										<p className="text-sm text-base-content/70 mt-2">
											💡 {exercise.cue}
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
};

export default TodayWorkout;
