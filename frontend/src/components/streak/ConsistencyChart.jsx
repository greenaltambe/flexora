import { Calendar, TrendingUp } from "lucide-react";

/**
 * ConsistencyChart Component
 *
 * Visualizes weekly workout consistency with a bar chart or heatmap.
 * Shows workout frequency per day of the week.
 *
 * @param {Object} props
 * @param {Object} props.consistencyData - Consistency data from streakStore.getWeeklyConsistency()
 * @param {Array} props.consistencyData.weeklyStats - Array of {dayName, workoutCount}
 * @param {number} props.consistencyData.consistencyPercentage - Overall consistency %
 * @param {number} props.consistencyData.totalWeeks - Number of weeks analyzed
 * @param {boolean} props.isLoading - Loading state
 */
const ConsistencyChart = ({ consistencyData, isLoading }) => {
	if (isLoading) {
		return (
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<div className="skeleton h-6 w-48 mb-4"></div>
					<div className="skeleton h-64 w-full"></div>
				</div>
			</div>
		);
	}

	if (!consistencyData || !consistencyData.weeklyStats) {
		return (
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<h3 className="card-title">
						<Calendar className="w-5 h-5" />
						Weekly Consistency
					</h3>
					<p className="text-base-content/70">
						No workout data available yet. Start logging workouts to
						see your consistency!
					</p>
				</div>
			</div>
		);
	}

	const { weeklyStats, consistencyPercentage, totalWeeks } = consistencyData;

	// Find max count for scaling
	const maxCount = Math.max(
		...weeklyStats.map((stat) => stat.workoutCount),
		1
	);

	// Day abbreviations
	const dayAbbreviations = {
		Monday: "Mon",
		Tuesday: "Tue",
		Wednesday: "Wed",
		Thursday: "Thu",
		Friday: "Fri",
		Saturday: "Sat",
		Sunday: "Sun",
	};

	// Get color based on workout count
	const getBarColor = (count) => {
		if (count === 0) return "bg-base-300";
		if (count >= maxCount * 0.8) return "bg-success";
		if (count >= maxCount * 0.5) return "bg-info";
		if (count >= maxCount * 0.3) return "bg-warning";
		return "bg-error/50";
	};

	return (
		<div className="card bg-base-100 shadow-lg">
			<div className="card-body">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<h3 className="card-title">
						<Calendar className="w-5 h-5" />
						Weekly Consistency
					</h3>
					<div className="flex items-center gap-2">
						<TrendingUp className="w-4 h-4 text-success" />
						<span className="text-2xl font-bold text-success">
							{consistencyPercentage}%
						</span>
					</div>
				</div>

				{/* Stats Summary */}
				<div className="stats shadow mb-6">
					<div className="stat place-items-center">
						<div className="stat-title text-xs">
							Consistency Rate
						</div>
						<div className="stat-value text-primary text-2xl">
							{consistencyPercentage}%
						</div>
						<div className="stat-desc">
							Over {totalWeeks}{" "}
							{totalWeeks === 1 ? "week" : "weeks"}
						</div>
					</div>
					<div className="stat place-items-center">
						<div className="stat-title text-xs">
							Most Active Day
						</div>
						<div className="stat-value text-info text-2xl">
							{weeklyStats
								.reduce((max, stat) =>
									stat.workoutCount > max.workoutCount
										? stat
										: max
								)
								.dayName.slice(0, 3)}
						</div>
						<div className="stat-desc">
							{Math.max(
								...weeklyStats.map((s) => s.workoutCount)
							)}{" "}
							workouts
						</div>
					</div>
				</div>

				{/* Bar Chart */}
				<div className="space-y-3">
					<p className="text-sm text-base-content/70 mb-4">
						Workouts per day of the week
					</p>
					<div className="flex items-end justify-between gap-2 h-64">
						{weeklyStats.map((stat) => {
							const heightPercentage =
								maxCount > 0
									? (stat.workoutCount / maxCount) * 100
									: 0;

							return (
								<div
									key={stat.dayName}
									className="flex-1 flex flex-col items-center gap-2"
								>
									{/* Bar */}
									<div className="relative w-full flex flex-col justify-end h-full">
										<div
											className={`
												w-full rounded-t-lg transition-all duration-300
												${getBarColor(stat.workoutCount)}
												hover:opacity-80 cursor-pointer
												tooltip tooltip-top
											`}
											style={{
												height: `${heightPercentage}%`,
											}}
											data-tip={`${stat.dayName}: ${stat.workoutCount} workouts`}
										>
											{stat.workoutCount > 0 && (
												<div className="text-center text-xs font-bold pt-2 text-base-content">
													{stat.workoutCount}
												</div>
											)}
										</div>
									</div>

									{/* Day Label */}
									<div className="text-xs font-semibold text-center">
										{dayAbbreviations[stat.dayName] ||
											stat.dayName.slice(0, 3)}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Legend */}
				<div className="flex flex-wrap gap-4 justify-center mt-6 text-xs">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-base-300"></div>
						<span>No workouts</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-error/50"></div>
						<span>Low</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-warning"></div>
						<span>Medium</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-info"></div>
						<span>Good</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-success"></div>
						<span>Excellent</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConsistencyChart;
