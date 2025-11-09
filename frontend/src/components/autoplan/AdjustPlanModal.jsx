import { useState, useEffect } from "react";
import {
	X,
	Save,
	RotateCcw,
	Sliders,
	TrendingUp,
	Activity,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * AdjustPlanModal Component
 *
 * Modal for adjusting auto-generated plan parameters.
 * Allows user to modify volume, intensity, frequency, and other plan settings.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.onSave - Callback when saving adjustments (receives adjustments object)
 * @param {Object} props.currentPlan - Current plan data to base adjustments on
 * @param {boolean} props.isSaving - Loading state for save action
 */
const AdjustPlanModal = ({
	isOpen,
	onClose,
	onSave,
	currentPlan,
	isSaving = false,
}) => {
	const [adjustments, setAdjustments] = useState({
		volumeAdjustment: 0,
		intensityAdjustment: 0,
		frequencyAdjustment: 0,
		difficultyPreference: "",
		notes: "",
	});

	const [previewData, setPreviewData] = useState(null);

	// Reset form when modal opens
	useEffect(() => {
		if (isOpen) {
			setAdjustments({
				volumeAdjustment: 0,
				intensityAdjustment: 0,
				frequencyAdjustment: 0,
				difficultyPreference: currentPlan?.difficulty || "",
				notes: "",
			});
			generatePreview({
				volumeAdjustment: 0,
				intensityAdjustment: 0,
				frequencyAdjustment: 0,
			});
		}
	}, [isOpen, currentPlan]);

	const handleSliderChange = (field, value) => {
		const newAdjustments = { ...adjustments, [field]: value };
		setAdjustments(newAdjustments);
		generatePreview(newAdjustments);
	};

	const handleReset = () => {
		const resetAdjustments = {
			volumeAdjustment: 0,
			intensityAdjustment: 0,
			frequencyAdjustment: 0,
			difficultyPreference: currentPlan?.difficulty || "",
			notes: "",
		};
		setAdjustments(resetAdjustments);
		generatePreview(resetAdjustments);
		toast.success("Adjustments reset");
	};

	const generatePreview = (newAdjustments) => {
		if (!currentPlan) return;

		// Calculate preview based on adjustments
		const baseVolume = currentPlan.weeklyVolume || 100;
		const baseIntensity = currentPlan.averageIntensity || 100;
		const baseFrequency = currentPlan.sessionsPerWeek || 3;

		const preview = {
			volume: Math.round(
				baseVolume * (1 + newAdjustments.volumeAdjustment / 100)
			),
			intensity: Math.round(
				baseIntensity * (1 + newAdjustments.intensityAdjustment / 100)
			),
			frequency: Math.max(
				1,
				Math.round(
					baseFrequency *
						(1 + newAdjustments.frequencyAdjustment / 100)
				)
			),
		};

		setPreviewData(preview);
	};

	const handleSave = async () => {
		// Validate that at least one adjustment is made
		const hasChanges =
			adjustments.volumeAdjustment !== 0 ||
			adjustments.intensityAdjustment !== 0 ||
			adjustments.frequencyAdjustment !== 0 ||
			adjustments.difficultyPreference !== currentPlan?.difficulty ||
			adjustments.notes.trim() !== "";

		if (!hasChanges) {
			toast.error("Please make at least one adjustment");
			return;
		}

		try {
			await onSave(adjustments);
			toast.success("Plan adjustments saved successfully!");
			onClose();
		} catch (error) {
			toast.error("Failed to save adjustments");
			console.error("Error saving adjustments:", error);
		}
	};

	const getAdjustmentColor = (value) => {
		if (value > 0) return "text-success";
		if (value < 0) return "text-error";
		return "text-base-content";
	};

	const getAdjustmentLabel = (value) => {
		if (value > 0) return `+${value}%`;
		if (value < 0) return `${value}%`;
		return "No change";
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Modal Backdrop */}
			<div className="modal modal-open">
				<div className="modal-box max-w-3xl">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg text-primary">
								<Sliders className="w-6 h-6" />
							</div>
							<div>
								<h3 className="font-bold text-xl">
									Adjust Your Plan
								</h3>
								<p className="text-sm text-base-content/70">
									Fine-tune your workout parameters
								</p>
							</div>
						</div>
						<button
							className="btn btn-sm btn-circle btn-ghost"
							onClick={onClose}
							disabled={isSaving}
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Current Plan Info */}
					{currentPlan && (
						<div className="alert alert-info mb-6">
							<Activity className="w-5 h-5" />
							<div className="text-sm">
								<div className="font-semibold">
									{currentPlan.name}
								</div>
								<div className="text-xs opacity-80">
									Current: {currentPlan.difficulty} • Week{" "}
									{currentPlan.weeksCompleted || 0}/
									{currentPlan.totalWeeks || 0}
								</div>
							</div>
						</div>
					)}

					<div className="space-y-6">
						{/* Volume Adjustment */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Volume Adjustment
								</span>
								<span
									className={`label-text-alt font-semibold ${getAdjustmentColor(
										adjustments.volumeAdjustment
									)}`}
								>
									{getAdjustmentLabel(
										adjustments.volumeAdjustment
									)}
								</span>
							</label>
							<input
								type="range"
								min="-30"
								max="30"
								step="5"
								value={adjustments.volumeAdjustment}
								onChange={(e) =>
									handleSliderChange(
										"volumeAdjustment",
										parseInt(e.target.value)
									)
								}
								className="range range-primary"
								disabled={isSaving}
							/>
							<div className="w-full flex justify-between text-xs px-2 text-base-content/60">
								<span>-30%</span>
								<span>0%</span>
								<span>+30%</span>
							</div>
							<p className="text-xs text-base-content/60 mt-2">
								Adjust the total number of sets per week
							</p>
						</div>

						{/* Intensity Adjustment */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Intensity Adjustment
								</span>
								<span
									className={`label-text-alt font-semibold ${getAdjustmentColor(
										adjustments.intensityAdjustment
									)}`}
								>
									{getAdjustmentLabel(
										adjustments.intensityAdjustment
									)}
								</span>
							</label>
							<input
								type="range"
								min="-20"
								max="20"
								step="5"
								value={adjustments.intensityAdjustment}
								onChange={(e) =>
									handleSliderChange(
										"intensityAdjustment",
										parseInt(e.target.value)
									)
								}
								className="range range-secondary"
								disabled={isSaving}
							/>
							<div className="w-full flex justify-between text-xs px-2 text-base-content/60">
								<span>-20%</span>
								<span>0%</span>
								<span>+20%</span>
							</div>
							<p className="text-xs text-base-content/60 mt-2">
								Adjust weight/resistance levels
							</p>
						</div>

						{/* Frequency Adjustment */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Frequency Adjustment
								</span>
								<span
									className={`label-text-alt font-semibold ${getAdjustmentColor(
										adjustments.frequencyAdjustment
									)}`}
								>
									{getAdjustmentLabel(
										adjustments.frequencyAdjustment
									)}
								</span>
							</label>
							<input
								type="range"
								min="-30"
								max="30"
								step="10"
								value={adjustments.frequencyAdjustment}
								onChange={(e) =>
									handleSliderChange(
										"frequencyAdjustment",
										parseInt(e.target.value)
									)
								}
								className="range range-accent"
								disabled={isSaving}
							/>
							<div className="w-full flex justify-between text-xs px-2 text-base-content/60">
								<span>-30%</span>
								<span>0%</span>
								<span>+30%</span>
							</div>
							<p className="text-xs text-base-content/60 mt-2">
								Adjust number of sessions per week
							</p>
						</div>

						{/* Difficulty Preference */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Difficulty Preference
								</span>
							</label>
							<select
								className="select select-bordered w-full"
								value={adjustments.difficultyPreference}
								onChange={(e) =>
									setAdjustments({
										...adjustments,
										difficultyPreference: e.target.value,
									})
								}
								disabled={isSaving}
							>
								<option value="">Keep Current</option>
								<option value="beginner">Beginner</option>
								<option value="intermediate">
									Intermediate
								</option>
								<option value="advanced">Advanced</option>
							</select>
						</div>

						{/* Notes */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">
									Notes (Optional)
								</span>
							</label>
							<textarea
								className="textarea textarea-bordered h-24"
								placeholder="Add any notes about why you're making these adjustments..."
								value={adjustments.notes}
								onChange={(e) =>
									setAdjustments({
										...adjustments,
										notes: e.target.value,
									})
								}
								disabled={isSaving}
							></textarea>
						</div>

						{/* Preview Section */}
						{previewData && (
							<div className="bg-base-200 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-3">
									<TrendingUp className="w-4 h-4 text-primary" />
									<h4 className="font-semibold text-sm">
										Preview Changes
									</h4>
								</div>
								<div className="grid grid-cols-3 gap-4">
									<div className="stat bg-base-100 rounded-lg p-3">
										<div className="stat-title text-xs">
											Weekly Volume
										</div>
										<div className="stat-value text-lg">
											{previewData.volume}
										</div>
										<div className="stat-desc text-xs">
											sets/week
										</div>
									</div>
									<div className="stat bg-base-100 rounded-lg p-3">
										<div className="stat-title text-xs">
											Avg Intensity
										</div>
										<div className="stat-value text-lg">
											{previewData.intensity}
										</div>
										<div className="stat-desc text-xs">
											% of max
										</div>
									</div>
									<div className="stat bg-base-100 rounded-lg p-3">
										<div className="stat-title text-xs">
											Frequency
										</div>
										<div className="stat-value text-lg">
											{previewData.frequency}
										</div>
										<div className="stat-desc text-xs">
											sessions/week
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Actions */}
					<div className="modal-action">
						<button
							className="btn btn-ghost gap-2"
							onClick={handleReset}
							disabled={isSaving}
						>
							<RotateCcw className="w-4 h-4" />
							Reset
						</button>
						<button
							className="btn btn-ghost"
							onClick={onClose}
							disabled={isSaving}
						>
							Cancel
						</button>
						<button
							className="btn btn-primary gap-2"
							onClick={handleSave}
							disabled={isSaving}
						>
							{isSaving ? (
								<span className="loading loading-spinner loading-sm"></span>
							) : (
								<Save className="w-4 h-4" />
							)}
							Save Adjustments
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdjustPlanModal;
