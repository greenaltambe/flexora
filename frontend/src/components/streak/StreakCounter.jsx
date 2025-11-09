import { Flame, Trophy, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * StreakCounter Component
 *
 * Displays user's workout streak information in a compact widget format.
 * Shows current streak, longest streak, and total workouts.
 * Can be embedded in Dashboard or other pages.
 *
 * @param {Object} props
 * @param {Object} props.streak - Streak data from streakStore
 * @param {number} props.streak.currentStreak - Current consecutive days
 * @param {number} props.streak.longestStreak - All-time longest streak
 * @param {number} props.streak.totalWorkouts - Total workouts completed
 * @param {string} props.streak.lastWorkoutDate - Last workout date (ISO format)
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.showDetails - Whether to show "View Details" link
 */
const StreakCounter = ({ streak, isLoading, showDetails = true }) => {
	if (isLoading) {
		return (
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<div className="flex items-center gap-4">
						<div className="skeleton h-16 w-16 rounded-full"></div>
						<div className="flex-1">
							<div className="skeleton h-4 w-32 mb-2"></div>
							<div className="skeleton h-6 w-24"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!streak) {
		return (
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<p className="text-base-content/70">
						Start your first workout to begin your streak! 💪
					</p>
				</div>
			</div>
		);
	}

	const isActiveStreak = streak.currentStreak > 0;

	return (
		<div className="card bg-linear-to-br from-primary/10 to-secondary/10 shadow-lg border border-primary/20">
			<div className="card-body">
				<div className="flex items-center justify-between">
					{/* Main Streak Display */}
					<div className="flex items-center gap-4">
						<div className="relative">
							<div
								className={`
								w-20 h-20 rounded-full flex items-center justify-center
								${isActiveStreak ? "bg-linear-to-br from-orange-500 to-red-500" : "bg-base-300"}
							`}
							>
								<Flame
									className={`
									w-10 h-10 
									${isActiveStreak ? "text-white" : "text-base-content/30"}
								`}
								/>
							</div>
							{isActiveStreak && (
								<div className="absolute -top-1 -right-1 badge badge-success badge-sm">
									Active
								</div>
							)}
						</div>

						<div>
							<div className="text-sm text-base-content/70 mb-1">
								Current Streak
							</div>
							<div className="text-4xl font-bold text-primary">
								{streak.currentStreak}
								<span className="text-xl text-base-content/70 ml-2">
									{streak.currentStreak === 1
										? "day"
										: "days"}
								</span>
							</div>
							{streak.lastWorkoutDate && (
								<div className="text-xs text-base-content/60 mt-1">
									Last workout:{" "}
									{new Date(
										streak.lastWorkoutDate
									).toLocaleDateString()}
								</div>
							)}
						</div>
					</div>

					{/* Additional Stats */}
					<div className="flex gap-4">
						<div className="text-center">
							<div className="flex items-center justify-center gap-1 mb-1">
								<Trophy className="w-4 h-4 text-warning" />
								<div className="text-xs text-base-content/70">
									Record
								</div>
							</div>
							<div className="text-2xl font-bold text-warning">
								{streak.longestStreak}
							</div>
						</div>

						<div className="divider divider-horizontal"></div>

						<div className="text-center">
							<div className="flex items-center justify-center gap-1 mb-1">
								<Calendar className="w-4 h-4 text-info" />
								<div className="text-xs text-base-content/70">
									Total
								</div>
							</div>
							<div className="text-2xl font-bold text-info">
								{streak.totalWorkouts}
							</div>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				{showDetails && (
					<div className="card-actions justify-end mt-4">
						<Link
							to="/streak-dashboard"
							className="btn btn-sm btn-primary btn-outline"
						>
							View Details
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default StreakCounter;
