import { Calendar, Target, TrendingUp, Dumbbell, Activity } from "lucide-react";

/**
 * AutoPlanOverview Component
 *
 * Displays overview of current auto-generated plan with key stats and information.
 *
 * @param {Object} props
 * @param {Object} props.plan - Auto-generated plan data
 * @param {string} props.plan.name - Plan name
 * @param {string} props.plan.goal - Primary fitness goal
 * @param {string} props.plan.difficulty - Difficulty level (beginner/intermediate/advanced)
 * @param {number} props.plan.weeksCompleted - Weeks completed so far
 * @param {number} props.plan.totalWeeks - Total weeks in plan
 * @param {Array} props.plan.exercises - List of exercises
 * @param {string} props.plan.status - Plan status (active/completed/paused)
 * @param {string} props.plan.createdAt - ISO date when plan was created
 * @param {boolean} props.isLoading - Loading state
 */
const AutoPlanOverview = ({ plan, isLoading }) => {
	if (isLoading) {
		return (
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<div className="skeleton h-8 w-64 mb-4"></div>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="skeleton h-24 w-full"></div>
						<div className="skeleton h-24 w-full"></div>
						<div className="skeleton h-24 w-full"></div>
						<div className="skeleton h-24 w-full"></div>
					</div>
				</div>
			</div>
		);
	}

	if (!plan) {
		return (
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body text-center">
					<Activity className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
					<h3 className="text-xl font-bold">No Active Plan</h3>
					<p className="text-base-content/70 mb-4">
						You don't have an active auto-generated plan yet.
					</p>
					<a href="/auto-plan/generate" className="btn btn-primary">
						Generate Your Plan
					</a>
				</div>
			</div>
		);
	}

	const completionPercentage =
		plan.totalWeeks > 0
			? Math.round((plan.weeksCompleted / plan.totalWeeks) * 100)
			: 0;

	const getStatusBadge = (status) => {
		const badges = {
			active: "badge-success",
			completed: "badge-info",
			paused: "badge-warning",
			inactive: "badge-error",
		};
		return badges[status] || "badge-ghost";
	};

	const getDifficultyColor = (difficulty) => {
		const colors = {
			beginner: "text-success",
			intermediate: "text-warning",
			advanced: "text-error",
		};
		return colors[difficulty?.toLowerCase()] || "text-base-content";
	};

	return (
		<div className="card bg-base-100 shadow-lg">
			<div className="card-body">
				{/* Plan Header */}
				<div className="flex items-start justify-between mb-6">
					<div>
						<h2 className="card-title text-2xl mb-2">
							{plan.name || "Your Personalized Plan"}
						</h2>
						<div className="flex items-center gap-2 flex-wrap">
							<span
								className={`badge ${getStatusBadge(
									plan.status
								)}`}
							>
								{plan.status?.toUpperCase() || "ACTIVE"}
							</span>
							<span
								className={`badge badge-outline ${getDifficultyColor(
									plan.difficulty
								)}`}
							>
								{plan.difficulty || "Intermediate"}
							</span>
							{plan.goal && (
								<span className="badge badge-outline">
									Goal: {plan.goal}
								</span>
							)}
						</div>
					</div>
					{plan.createdAt && (
						<div className="text-right text-sm text-base-content/70">
							<div>Created</div>
							<div className="font-semibold">
								{new Date(plan.createdAt).toLocaleDateString()}
							</div>
						</div>
					)}
				</div>

				{/* Progress Bar */}
				{plan.totalWeeks && (
					<div className="mb-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-semibold">
								Week {plan.weeksCompleted || 0} of{" "}
								{plan.totalWeeks}
							</span>
							<span className="text-sm text-base-content/70">
								{completionPercentage}% Complete
							</span>
						</div>
						<progress
							className="progress progress-primary w-full"
							value={plan.weeksCompleted || 0}
							max={plan.totalWeeks}
						></progress>
					</div>
				)}

				{/* Stats Cards */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{/* Total Weeks */}
					<div className="stat bg-base-200 rounded-lg p-4">
						<div className="stat-figure text-primary">
							<Calendar className="w-6 h-6" />
						</div>
						<div className="stat-title text-xs">Duration</div>
						<div className="stat-value text-2xl">
							{plan.totalWeeks || 0}
						</div>
						<div className="stat-desc">weeks</div>
					</div>

					{/* Exercises Count */}
					<div className="stat bg-base-200 rounded-lg p-4">
						<div className="stat-figure text-secondary">
							<Dumbbell className="w-6 h-6" />
						</div>
						<div className="stat-title text-xs">Exercises</div>
						<div className="stat-value text-2xl">
							{plan.exercises?.length || 0}
						</div>
						<div className="stat-desc">unique</div>
					</div>

					{/* Progress */}
					<div className="stat bg-base-200 rounded-lg p-4">
						<div className="stat-figure text-accent">
							<TrendingUp className="w-6 h-6" />
						</div>
						<div className="stat-title text-xs">Progress</div>
						<div className="stat-value text-2xl">
							{completionPercentage}%
						</div>
						<div className="stat-desc">complete</div>
					</div>

					{/* Goal */}
					<div className="stat bg-base-200 rounded-lg p-4">
						<div className="stat-figure text-success">
							<Target className="w-6 h-6" />
						</div>
						<div className="stat-title text-xs">Goal</div>
						<div className="stat-value text-lg line-clamp-1">
							{plan.goal || "General"}
						</div>
						<div className="stat-desc">fitness</div>
					</div>
				</div>

				{/* Plan Description */}
				{plan.description && (
					<div className="mt-6 p-4 bg-base-200 rounded-lg">
						<h3 className="font-semibold mb-2">About This Plan</h3>
						<p className="text-sm text-base-content/80">
							{plan.description}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AutoPlanOverview;
