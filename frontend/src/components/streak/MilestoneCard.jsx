import { Trophy, Star, Flame, Award, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * MilestoneCard Component
 *
 * Displays individual milestone achievements with celebration visuals.
 * Allows users to acknowledge milestones they've seen.
 *
 * @param {Object} props
 * @param {Object} props.milestone - Milestone data
 * @param {string} props.milestone.type - Milestone type (streak_milestone, volume_milestone, workout_count)
 * @param {string} props.milestone.description - Achievement description
 * @param {string} props.milestone.achievedAt - ISO date when achieved
 * @param {boolean} props.milestone.acknowledged - Whether user has seen it
 * @param {Function} props.onAcknowledge - Callback when milestone acknowledged
 */
const MilestoneCard = ({ milestone, onAcknowledge }) => {
	const [isAcknowledging, setIsAcknowledging] = useState(false);

	const getMilestoneIcon = (type) => {
		switch (type) {
			case "streak_milestone":
				return Flame;
			case "volume_milestone":
				return Award;
			case "workout_count":
				return Trophy;
			default:
				return Star;
		}
	};

	const getMilestoneColor = (type) => {
		switch (type) {
			case "streak_milestone":
				return "text-orange-500 bg-orange-500/10";
			case "volume_milestone":
				return "text-purple-500 bg-purple-500/10";
			case "workout_count":
				return "text-yellow-500 bg-yellow-500/10";
			default:
				return "text-primary bg-primary/10";
		}
	};

	const getMilestoneLabel = (type) => {
		switch (type) {
			case "streak_milestone":
				return "Streak Achievement";
			case "volume_milestone":
				return "Volume Achievement";
			case "workout_count":
				return "Workout Milestone";
			default:
				return "Achievement";
		}
	};

	const handleAcknowledge = async () => {
		if (isAcknowledging || milestone.acknowledged) return;

		setIsAcknowledging(true);
		try {
			await onAcknowledge(milestone.type);
			toast.success("Milestone acknowledged! 🎉");
		} catch (error) {
			toast.error("Failed to acknowledge milestone");
		} finally {
			setIsAcknowledging(false);
		}
	};

	const Icon = getMilestoneIcon(milestone.type);
	const colorClass = getMilestoneColor(milestone.type);

	return (
		<div
			className={`
			card bg-base-100 shadow-lg border-2 
			${milestone.acknowledged ? "border-base-300" : "border-primary"}
			${!milestone.acknowledged && "animate-pulse-slow"}
		`}
		>
			<div className="card-body">
				<div className="flex items-start gap-4">
					{/* Icon */}
					<div
						className={`
						w-16 h-16 rounded-full flex items-center justify-center
						${colorClass}
					`}
					>
						<Icon className="w-8 h-8" />
					</div>

					{/* Content */}
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<span className="badge badge-primary badge-sm">
								{getMilestoneLabel(milestone.type)}
							</span>
							{!milestone.acknowledged && (
								<span className="badge badge-accent badge-sm">
									New!
								</span>
							)}
						</div>

						<h3 className="font-bold text-lg mb-2">
							{milestone.description}
						</h3>

						<p className="text-sm text-base-content/70">
							Achieved on{" "}
							{new Date(milestone.achievedAt).toLocaleDateString(
								"en-US",
								{
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								}
							)}
						</p>

						{/* Actions */}
						<div className="card-actions justify-end mt-4">
							{milestone.acknowledged ? (
								<div className="flex items-center gap-2 text-success">
									<Check className="w-4 h-4" />
									<span className="text-sm">
										Acknowledged
									</span>
								</div>
							) : (
								<button
									onClick={handleAcknowledge}
									disabled={isAcknowledging}
									className="btn btn-primary btn-sm"
								>
									{isAcknowledging ? (
										<span className="loading loading-spinner loading-xs"></span>
									) : (
										"Acknowledge"
									)}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Celebration Effect for Unacknowledged */}
			{!milestone.acknowledged && (
				<div className="absolute -top-2 -right-2">
					<div className="relative">
						<Star
							className="w-8 h-8 text-warning animate-spin-slow"
							fill="currentColor"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default MilestoneCard;
