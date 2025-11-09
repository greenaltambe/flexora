import { useState } from "react";
import {
	TrendingUp,
	Check,
	X,
	ChevronDown,
	ChevronUp,
	Activity,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * ProgressionSuggestion Component
 *
 * Displays progression suggestions from the backend with before/after comparison.
 * Allows user to apply or decline suggested changes to their plan.
 *
 * @param {Object} props
 * @param {Object} props.suggestion - Progression suggestion data
 * @param {string} props.suggestion.id - Suggestion ID
 * @param {string} props.suggestion.type - Type of progression (volume/intensity/exercise)
 * @param {Object} props.suggestion.changes - Suggested changes
 * @param {string} props.suggestion.reason - Why this progression is suggested
 * @param {Date} props.suggestion.suggestedAt - When suggestion was created
 * @param {Function} props.onApply - Callback when applying suggestion
 * @param {Function} props.onDecline - Callback when declining suggestion
 * @param {boolean} props.isApplying - Loading state for apply action
 */
const ProgressionSuggestion = ({
	suggestion,
	onApply,
	onDecline,
	isApplying = false,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);

	if (!suggestion) {
		return null;
	}

	const handleApply = async () => {
		try {
			await onApply(suggestion.id);
			toast.success("Progression applied successfully!");
		} catch (error) {
			toast.error("Failed to apply progression");
			console.error("Error applying progression:", error);
		}
	};

	const handleDecline = () => {
		try {
			onDecline(suggestion.id);
			toast.success("Progression declined");
		} catch (error) {
			toast.error("Failed to decline progression");
			console.error("Error declining progression:", error);
		}
	};

	const getProgressionTypeIcon = (type) => {
		return <TrendingUp className="w-5 h-5" />;
	};

	const getProgressionTypeBadge = (type) => {
		const badges = {
			volume: "badge-info",
			intensity: "badge-warning",
			exercise: "badge-success",
			frequency: "badge-primary",
		};
		return badges[type?.toLowerCase()] || "badge-ghost";
	};

	const renderChangeComparison = (change) => {
		const { exerciseName, field, oldValue, newValue } = change;

		return (
			<div
				key={`${exerciseName}-${field}`}
				className="flex items-center gap-4 py-2"
			>
				<div className="flex-1">
					<div className="font-semibold text-sm">{exerciseName}</div>
					<div className="text-xs text-base-content/70 capitalize">
						{field}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="badge badge-outline">{oldValue}</div>
					<span className="text-base-content/50">→</span>
					<div className="badge badge-primary">{newValue}</div>
				</div>
			</div>
		);
	};

	return (
		<div className="card bg-base-100 border border-base-300 hover:border-primary transition-colors">
			<div className="card-body p-4">
				{/* Header */}
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-3 flex-1">
						<div className="p-2 bg-primary/10 rounded-lg text-primary">
							{getProgressionTypeIcon(suggestion.type)}
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<h3 className="font-semibold">
									{suggestion.title ||
										"Progression Suggestion"}
								</h3>
								<span
									className={`badge badge-sm ${getProgressionTypeBadge(
										suggestion.type
									)}`}
								>
									{suggestion.type || "Update"}
								</span>
							</div>
							{suggestion.reason && (
								<p className="text-sm text-base-content/70">
									{suggestion.reason}
								</p>
							)}
							{suggestion.suggestedAt && (
								<p className="text-xs text-base-content/50 mt-1">
									Suggested{" "}
									{new Date(
										suggestion.suggestedAt
									).toLocaleDateString()}
								</p>
							)}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center gap-2">
						<button
							className="btn btn-sm btn-ghost btn-circle"
							onClick={() => setIsExpanded(!isExpanded)}
							aria-label={isExpanded ? "Collapse" : "Expand"}
						>
							{isExpanded ? (
								<ChevronUp className="w-4 h-4" />
							) : (
								<ChevronDown className="w-4 h-4" />
							)}
						</button>
					</div>
				</div>

				{/* Expanded Details */}
				{isExpanded && (
					<div className="mt-4 space-y-4">
						{/* Changes List */}
						{suggestion.changes && suggestion.changes.length > 0 ? (
							<div className="bg-base-200 rounded-lg p-3">
								<h4 className="text-sm font-semibold mb-2">
									Proposed Changes
								</h4>
								<div className="divide-y divide-base-300">
									{suggestion.changes.map((change, index) => (
										<div key={index}>
											{renderChangeComparison(change)}
										</div>
									))}
								</div>
							</div>
						) : (
							<div className="text-center py-4 text-base-content/50">
								<Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
								<p className="text-sm">
									No specific changes available
								</p>
							</div>
						)}

						{/* Additional Info */}
						{suggestion.notes && (
							<div className="alert alert-info">
								<div className="text-sm">
									{suggestion.notes}
								</div>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex items-center gap-2 justify-end pt-2">
							<button
								className="btn btn-sm btn-ghost gap-2"
								onClick={handleDecline}
								disabled={isApplying}
							>
								<X className="w-4 h-4" />
								Decline
							</button>
							<button
								className="btn btn-sm btn-primary gap-2"
								onClick={handleApply}
								disabled={isApplying}
							>
								{isApplying ? (
									<span className="loading loading-spinner loading-sm"></span>
								) : (
									<Check className="w-4 h-4" />
								)}
								Apply Changes
							</button>
						</div>
					</div>
				)}

				{/* Collapsed Quick Actions */}
				{!isExpanded && (
					<div className="flex items-center gap-2 justify-end mt-2">
						<button
							className="btn btn-xs btn-ghost gap-1"
							onClick={handleDecline}
							disabled={isApplying}
						>
							<X className="w-3 h-3" />
							Decline
						</button>
						<button
							className="btn btn-xs btn-primary gap-1"
							onClick={handleApply}
							disabled={isApplying}
						>
							{isApplying ? (
								<span className="loading loading-spinner loading-xs"></span>
							) : (
								<Check className="w-3 h-3" />
							)}
							Apply
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * ProgressionSuggestionList Component
 *
 * Container component to display multiple progression suggestions.
 *
 * @param {Object} props
 * @param {Array} props.suggestions - Array of progression suggestions
 * @param {Function} props.onApply - Callback when applying suggestion
 * @param {Function} props.onDecline - Callback when declining suggestion
 * @param {string} props.applyingId - ID of suggestion being applied (for loading state)
 * @param {boolean} props.isLoading - Loading state for fetching suggestions
 */
export const ProgressionSuggestionList = ({
	suggestions = [],
	onApply,
	onDecline,
	applyingId,
	isLoading = false,
}) => {
	if (isLoading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="skeleton h-32 w-full"></div>
				))}
			</div>
		);
	}

	if (!suggestions || suggestions.length === 0) {
		return (
			<div className="card bg-base-100 border border-base-300">
				<div className="card-body text-center py-12">
					<TrendingUp className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
					<h3 className="text-xl font-bold">
						No Progressions Available
					</h3>
					<p className="text-base-content/70">
						Complete more workouts to get progression suggestions
						based on your performance.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{suggestions.map((suggestion) => (
				<ProgressionSuggestion
					key={suggestion.id}
					suggestion={suggestion}
					onApply={onApply}
					onDecline={onDecline}
					isApplying={applyingId === suggestion.id}
				/>
			))}
		</div>
	);
};

export default ProgressionSuggestion;
