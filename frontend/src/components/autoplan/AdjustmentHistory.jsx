import { useState } from "react";
import {
	ChevronDown,
	ChevronUp,
	Clock,
	TrendingUp,
	TrendingDown,
	Minus,
	FileText,
	History,
} from "lucide-react";

/**
 * AdjustmentHistoryItem Component
 *
 * Individual adjustment history entry with expandable details.
 *
 * @param {Object} props
 * @param {Object} props.adjustment - Adjustment data
 * @param {string} props.adjustment.id - Adjustment ID
 * @param {Date} props.adjustment.adjustedAt - When adjustment was made
 * @param {string} props.adjustment.type - Type of adjustment (manual/auto/progression)
 * @param {Object} props.adjustment.changes - Changes made
 * @param {string} props.adjustment.notes - Optional notes
 * @param {string} props.adjustment.reason - Reason for adjustment
 */
const AdjustmentHistoryItem = ({ adjustment }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	if (!adjustment) return null;

	const getTypeIcon = (type) => {
		switch (type?.toLowerCase()) {
			case "auto":
			case "progression":
				return <TrendingUp className="w-4 h-4" />;
			case "manual":
				return <FileText className="w-4 h-4" />;
			default:
				return <History className="w-4 h-4" />;
		}
	};

	const getTypeBadge = (type) => {
		const badges = {
			auto: "badge-info",
			progression: "badge-success",
			manual: "badge-warning",
			system: "badge-ghost",
		};
		return badges[type?.toLowerCase()] || "badge-ghost";
	};

	const renderChangeIndicator = (value) => {
		if (value > 0) {
			return (
				<span className="flex items-center gap-1 text-success">
					<TrendingUp className="w-3 h-3" />+{value}%
				</span>
			);
		} else if (value < 0) {
			return (
				<span className="flex items-center gap-1 text-error">
					<TrendingDown className="w-3 h-3" />
					{value}%
				</span>
			);
		}
		return (
			<span className="flex items-center gap-1 text-base-content/50">
				<Minus className="w-3 h-3" />
				No change
			</span>
		);
	};

	const formatDate = (date) => {
		const d = new Date(date);
		return d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="card bg-base-100 border border-base-300">
			<div className="card-body p-4">
				{/* Header */}
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-3 flex-1">
						{/* Timeline Dot */}
						<div className="flex flex-col items-center">
							<div className="p-2 bg-primary/10 rounded-full text-primary">
								{getTypeIcon(adjustment.type)}
							</div>
							{!isExpanded && (
								<div className="w-0.5 h-4 bg-base-300 mt-1"></div>
							)}
						</div>

						{/* Content */}
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<h4 className="font-semibold text-sm">
									{adjustment.title || "Plan Adjustment"}
								</h4>
								<span
									className={`badge badge-sm ${getTypeBadge(
										adjustment.type
									)}`}
								>
									{adjustment.type || "Manual"}
								</span>
							</div>
							<div className="flex items-center gap-2 text-xs text-base-content/60 mb-2">
								<Clock className="w-3 h-3" />
								<span>{formatDate(adjustment.adjustedAt)}</span>
							</div>
							{adjustment.reason && !isExpanded && (
								<p className="text-sm text-base-content/70 line-clamp-1">
									{adjustment.reason}
								</p>
							)}
						</div>
					</div>

					{/* Expand Button */}
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

				{/* Expanded Details */}
				{isExpanded && (
					<div className="mt-4 ml-11 space-y-4">
						{/* Reason */}
						{adjustment.reason && (
							<div>
								<h5 className="text-xs font-semibold text-base-content/70 mb-1">
									Reason
								</h5>
								<p className="text-sm">{adjustment.reason}</p>
							</div>
						)}

						{/* Changes */}
						{adjustment.changes &&
							Object.keys(adjustment.changes).length > 0 && (
								<div>
									<h5 className="text-xs font-semibold text-base-content/70 mb-2">
										Changes Made
									</h5>
									<div className="bg-base-200 rounded-lg p-3 space-y-2">
										{adjustment.changes.volumeAdjustment !==
											undefined && (
											<div className="flex items-center justify-between">
												<span className="text-sm">
													Volume
												</span>
												{renderChangeIndicator(
													adjustment.changes
														.volumeAdjustment
												)}
											</div>
										)}
										{adjustment.changes
											.intensityAdjustment !==
											undefined && (
											<div className="flex items-center justify-between">
												<span className="text-sm">
													Intensity
												</span>
												{renderChangeIndicator(
													adjustment.changes
														.intensityAdjustment
												)}
											</div>
										)}
										{adjustment.changes
											.frequencyAdjustment !==
											undefined && (
											<div className="flex items-center justify-between">
												<span className="text-sm">
													Frequency
												</span>
												{renderChangeIndicator(
													adjustment.changes
														.frequencyAdjustment
												)}
											</div>
										)}
										{adjustment.changes
											.difficultyPreference && (
											<div className="flex items-center justify-between">
												<span className="text-sm">
													Difficulty
												</span>
												<span className="badge badge-sm badge-outline">
													{
														adjustment.changes
															.difficultyPreference
													}
												</span>
											</div>
										)}
									</div>
								</div>
							)}

						{/* Notes */}
						{adjustment.notes && (
							<div>
								<h5 className="text-xs font-semibold text-base-content/70 mb-1">
									Notes
								</h5>
								<div className="bg-base-200 rounded-lg p-3">
									<p className="text-sm">
										{adjustment.notes}
									</p>
								</div>
							</div>
						)}

						{/* Applied By */}
						{adjustment.appliedBy && (
							<div className="text-xs text-base-content/50">
								Applied by {adjustment.appliedBy}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * AdjustmentHistory Component
 *
 * Displays a timeline of all plan adjustments.
 *
 * @param {Object} props
 * @param {Array} props.adjustments - Array of adjustment objects
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onLoadMore - Callback to load more history (pagination)
 * @param {boolean} props.hasMore - Whether there are more items to load
 */
const AdjustmentHistory = ({
	adjustments = [],
	isLoading = false,
	onLoadMore,
	hasMore = false,
}) => {
	if (isLoading && adjustments.length === 0) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="skeleton h-32 w-full"></div>
				))}
			</div>
		);
	}

	if (!adjustments || adjustments.length === 0) {
		return (
			<div className="card bg-base-100 border border-base-300">
				<div className="card-body text-center py-12">
					<History className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
					<h3 className="text-xl font-bold">No Adjustment History</h3>
					<p className="text-base-content/70">
						Your plan adjustments will appear here once you make
						changes.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-bold">Adjustment History</h3>
					<p className="text-sm text-base-content/70">
						{adjustments.length} adjustment
						{adjustments.length !== 1 ? "s" : ""} made
					</p>
				</div>
			</div>

			{/* Timeline */}
			<div className="space-y-3">
				{adjustments.map((adjustment, index) => (
					<div key={adjustment.id || index} className="relative">
						<AdjustmentHistoryItem adjustment={adjustment} />
						{/* Timeline Line */}
						{index < adjustments.length - 1 && (
							<div className="absolute left-[18px] top-[calc(100%-8px)] w-0.5 h-3 bg-base-300 z-0"></div>
						)}
					</div>
				))}
			</div>

			{/* Load More */}
			{hasMore && onLoadMore && (
				<div className="text-center pt-4">
					<button
						className="btn btn-outline btn-sm gap-2"
						onClick={onLoadMore}
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="loading loading-spinner loading-sm"></span>
						) : (
							<History className="w-4 h-4" />
						)}
						Load More
					</button>
				</div>
			)}
		</div>
	);
};

export default AdjustmentHistory;
