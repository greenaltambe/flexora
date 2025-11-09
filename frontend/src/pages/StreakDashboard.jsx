import { useEffect, useState } from "react";
import { ArrowLeft, Snowflake, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useStreakStore } from "../store/streak/streakStore";
import PageContainer from "../components/PageContainer";
import StreakCounter from "../components/streak/StreakCounter";
import MilestoneCard from "../components/streak/MilestoneCard";
import ConsistencyChart from "../components/streak/ConsistencyChart";
import FreezeDayModal from "../components/streak/FreezeDayModal";
import toast from "react-hot-toast";

/**
 * StreakDashboard Page
 *
 * Comprehensive view of user's streak stats, milestones, and consistency.
 * Shows:
 * - Current streak counter
 * - List of milestones (acknowledged and new)
 * - Weekly consistency chart
 * - Freeze day management
 */
const StreakDashboard = () => {
	const {
		streak,
		streakSummary,
		milestones,
		consistencyData,
		isLoading,
		getStreak,
		getStreakSummary,
		getMilestones,
		acknowledgeMilestone,
		getWeeklyConsistency,
		addFreezeDay,
	} = useStreakStore();

	const [isFreezeDayModalOpen, setIsFreezeDayModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("overview"); // overview, milestones, consistency

	useEffect(() => {
		// Load all streak data on mount
		getStreak();
		getStreakSummary();
		getMilestones();
		getWeeklyConsistency();
	}, []);

	const handleAcknowledgeMilestone = async (type) => {
		const result = await acknowledgeMilestone(type);
		if (result.success) {
			// Refresh milestones after acknowledgment
			getMilestones();
		}
		return result;
	};

	const handleRequestFreezeDay = async (date, reason) => {
		const result = await addFreezeDay(date, reason);
		if (result.success) {
			// Refresh streak data after adding freeze day
			getStreak();
			getStreakSummary();
		} else {
			throw new Error(result.message || "Failed to add freeze day");
		}
	};

	const unacknowledgedMilestones =
		milestones?.filter((m) => !m.acknowledged) || [];
	const acknowledgedMilestones =
		milestones?.filter((m) => m.acknowledged) || [];

	return (
		<PageContainer>
			<div className="flex flex-col gap-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link
							to="/dashboard"
							className="btn btn-ghost btn-circle"
						>
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<div>
							<h1 className="text-3xl font-bold">Your Streak</h1>
							<p className="text-base-content/70">
								Track your consistency and celebrate
								achievements
							</p>
						</div>
					</div>

					{/* Freeze Day Button */}
					<button
						onClick={() => setIsFreezeDayModalOpen(true)}
						className="btn btn-info gap-2"
						disabled={
							!streakSummary ||
							streakSummary.freezeDaysRemaining <= 0
						}
					>
						<Snowflake className="w-4 h-4" />
						Request Freeze Day
						{streakSummary && (
							<span className="badge badge-sm">
								{streakSummary.freezeDaysRemaining}
							</span>
						)}
					</button>
				</div>

				{/* Streak Counter */}
				<StreakCounter
					streak={streak}
					isLoading={isLoading}
					showDetails={false}
				/>

				{/* Tabs */}
				<div className="tabs tabs-boxed bg-base-200 p-1">
					<button
						className={`tab ${
							activeTab === "overview" ? "tab-active" : ""
						}`}
						onClick={() => setActiveTab("overview")}
					>
						Overview
					</button>
					<button
						className={`tab ${
							activeTab === "milestones" ? "tab-active" : ""
						}`}
						onClick={() => setActiveTab("milestones")}
					>
						Milestones
						{unacknowledgedMilestones.length > 0 && (
							<span className="badge badge-accent badge-sm ml-2">
								{unacknowledgedMilestones.length}
							</span>
						)}
					</button>
					<button
						className={`tab ${
							activeTab === "consistency" ? "tab-active" : ""
						}`}
						onClick={() => setActiveTab("consistency")}
					>
						Consistency
					</button>
				</div>

				{/* Tab Content */}
				{activeTab === "overview" && (
					<div className="space-y-6">
						{/* Streak Summary Stats */}
						{streakSummary && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="stat bg-base-100 shadow-lg rounded-lg">
									<div className="stat-title">
										At Risk Days
									</div>
									<div className="stat-value text-warning">
										{streakSummary.atRiskDays || 0}
									</div>
									<div className="stat-desc">
										Days you almost lost your streak
									</div>
								</div>

								<div className="stat bg-base-100 shadow-lg rounded-lg">
									<div className="stat-title">
										Freeze Days Used
									</div>
									<div className="stat-value text-info">
										{streakSummary.freezeDaysUsed || 0}
									</div>
									<div className="stat-desc">
										{streakSummary.freezeDaysRemaining || 0}{" "}
										remaining
									</div>
								</div>

								<div className="stat bg-base-100 shadow-lg rounded-lg">
									<div className="stat-title">
										Current Status
									</div>
									<div
										className={`stat-value ${
											streakSummary.status === "active"
												? "text-success"
												: "text-error"
										}`}
									>
										{streakSummary.status === "active"
											? "🔥 Active"
											: "💤 Inactive"}
									</div>
									<div className="stat-desc">
										{streakSummary.lastWorkoutDate
											? `Last: ${new Date(
													streakSummary.lastWorkoutDate
											  ).toLocaleDateString()}`
											: "No workouts yet"}
									</div>
								</div>
							</div>
						)}

						{/* Recent Milestones */}
						{unacknowledgedMilestones.length > 0 && (
							<div>
								<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
									<Trophy className="w-5 h-5 text-warning" />
									New Achievements! 🎉
								</h2>
								<div className="grid grid-cols-1 gap-4">
									{unacknowledgedMilestones
										.slice(0, 3)
										.map((milestone, index) => (
											<MilestoneCard
												key={index}
												milestone={milestone}
												onAcknowledge={
													handleAcknowledgeMilestone
												}
											/>
										))}
								</div>
							</div>
						)}

						{/* Consistency Preview */}
						<ConsistencyChart
							consistencyData={consistencyData}
							isLoading={isLoading}
						/>
					</div>
				)}

				{activeTab === "milestones" && (
					<div className="space-y-6">
						{/* New Milestones */}
						{unacknowledgedMilestones.length > 0 && (
							<div>
								<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
									<Trophy className="w-5 h-5 text-warning" />
									New Achievements
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{unacknowledgedMilestones.map(
										(milestone, index) => (
											<MilestoneCard
												key={index}
												milestone={milestone}
												onAcknowledge={
													handleAcknowledgeMilestone
												}
											/>
										)
									)}
								</div>
							</div>
						)}

						{/* Acknowledged Milestones */}
						{acknowledgedMilestones.length > 0 && (
							<div>
								<h2 className="text-xl font-bold mb-4 text-base-content/70">
									Previous Achievements
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{acknowledgedMilestones.map(
										(milestone, index) => (
											<MilestoneCard
												key={index}
												milestone={milestone}
												onAcknowledge={
													handleAcknowledgeMilestone
												}
											/>
										)
									)}
								</div>
							</div>
						)}

						{/* No Milestones */}
						{milestones && milestones.length === 0 && (
							<div className="card bg-base-100 shadow-lg">
								<div className="card-body text-center">
									<Trophy className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
									<h3 className="text-xl font-bold">
										No Milestones Yet
									</h3>
									<p className="text-base-content/70">
										Keep working out to unlock achievements!
									</p>
									<Link
										to="/today-workout"
										className="btn btn-primary mt-4"
									>
										Start Today's Workout
									</Link>
								</div>
							</div>
						)}
					</div>
				)}

				{activeTab === "consistency" && (
					<div className="space-y-6">
						<ConsistencyChart
							consistencyData={consistencyData}
							isLoading={isLoading}
						/>

						{/* Additional consistency info */}
						{consistencyData && (
							<div className="card bg-base-100 shadow-lg">
								<div className="card-body">
									<h3 className="card-title mb-4">
										Tips to Improve Consistency
									</h3>
									<ul className="list-disc list-inside space-y-2 text-base-content/80">
										<li>
											Schedule your workouts at the same
											time each day
										</li>
										<li>
											Set realistic goals and celebrate
											small wins
										</li>
										<li>
											Find a workout buddy for
											accountability
										</li>
										<li>
											Use freeze days strategically when
											needed
										</li>
										<li>
											Track your progress to stay
											motivated
										</li>
									</ul>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Freeze Day Modal */}
			<FreezeDayModal
				isOpen={isFreezeDayModalOpen}
				onClose={() => setIsFreezeDayModalOpen(false)}
				onSubmit={handleRequestFreezeDay}
				availableFreezes={streakSummary?.freezeDaysRemaining || 0}
			/>
		</PageContainer>
	);
};

export default StreakDashboard;
