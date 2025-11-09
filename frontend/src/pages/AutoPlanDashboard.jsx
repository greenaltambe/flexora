import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	TrendingUp,
	Settings,
	History,
	LayoutDashboard,
	Plus,
	Power,
	AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAutoPlanStore } from "../store/autoPlan/autoPlanStore";
import AutoPlanOverview from "../components/autoplan/AutoPlanOverview";
import { ProgressionSuggestionList } from "../components/autoplan/ProgressionSuggestion";
import AdjustmentHistory from "../components/autoplan/AdjustmentHistory";
import AdjustPlanModal from "../components/autoplan/AdjustPlanModal";
import PageContainer from "../components/PageContainer";

const AutoPlanDashboard = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("overview");
	const [showAdjustModal, setShowAdjustModal] = useState(false);
	const [showDeactivateModal, setShowDeactivateModal] = useState(false);
	const [applyingProgressionId, setApplyingProgressionId] = useState(null);

	const {
		currentPlan,
		isLoading,
		getCurrentAutoPlan,
		adjustAutoPlan,
		triggerProgression,
		deactivateAutoPlan,
	} = useAutoPlanStore();

	// Load current plan on mount
	useEffect(() => {
		loadPlan();
	}, []);

	const loadPlan = async () => {
		const result = await getCurrentAutoPlan();
		if (!result.success && result.message) {
			toast.error(result.message);
		}
	};

	const handleAdjustPlan = async (adjustments) => {
		if (!currentPlan?.id) return;

		const result = await adjustAutoPlan(currentPlan.id, adjustments);
		if (result.success) {
			toast.success("Plan adjusted successfully!");
			setShowAdjustModal(false);
			loadPlan(); // Reload to get updated plan
		} else {
			toast.error(result.message || "Failed to adjust plan");
		}
	};

	const handleApplyProgression = async (suggestionId) => {
		if (!currentPlan?.id) return;

		setApplyingProgressionId(suggestionId);
		const result = await triggerProgression(currentPlan.id, true);
		setApplyingProgressionId(null);

		if (result.success) {
			toast.success("Progression applied successfully!");
			loadPlan(); // Reload to get updated plan
		} else {
			toast.error(result.message || "Failed to apply progression");
		}
	};

	const handleDeclineProgression = (suggestionId) => {
		// For now just show a toast, backend might need endpoint to track declined suggestions
		toast.success("Progression suggestion declined");
	};

	const handleTriggerProgression = async () => {
		if (!currentPlan?.id) return;

		const result = await triggerProgression(currentPlan.id, false);
		if (result.success) {
			if (result.data?.suggestions) {
				toast.success("Progression suggestions generated!");
				setActiveTab("progressions"); // Switch to progressions tab
			} else {
				toast.info("No progressions available at this time");
			}
		} else {
			toast.error(result.message || "Failed to trigger progression");
		}
	};

	const handleDeactivatePlan = async () => {
		if (!currentPlan?.id) return;

		const result = await deactivateAutoPlan(currentPlan.id);
		if (result.success) {
			toast.success("Plan deactivated successfully");
			setShowDeactivateModal(false);
			navigate("/auto-plan/generate");
		} else {
			toast.error(result.message || "Failed to deactivate plan");
		}
	};

	const tabs = [
		{ id: "overview", label: "Overview", icon: LayoutDashboard },
		{ id: "progressions", label: "Progressions", icon: TrendingUp },
		{ id: "adjustments", label: "Adjustments", icon: History },
		{ id: "settings", label: "Settings", icon: Settings },
	];

	return (
		<PageContainer>
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<button
							className="btn btn-circle btn-ghost"
							onClick={() => navigate("/dashboard")}
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<div>
							<h1 className="text-3xl font-bold">
								Auto Plan Dashboard
							</h1>
							<p className="text-base-content/70">
								Manage your AI-generated workout plan
							</p>
						</div>
					</div>

					{/* Quick Actions */}
					{currentPlan && (
						<div className="flex items-center gap-2">
							<button
								className="btn btn-outline btn-sm gap-2"
								onClick={() => setShowAdjustModal(true)}
							>
								<Plus className="w-4 h-4" />
								Adjust
							</button>
							<button
								className="btn btn-primary btn-sm gap-2"
								onClick={handleTriggerProgression}
								disabled={isLoading}
							>
								<TrendingUp className="w-4 h-4" />
								Progress
							</button>
						</div>
					)}
				</div>

				{/* Tabs */}
				<div className="tabs tabs-boxed bg-base-200 mb-6">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								key={tab.id}
								className={`tab gap-2 ${
									activeTab === tab.id ? "tab-active" : ""
								}`}
								onClick={() => setActiveTab(tab.id)}
							>
								<Icon className="w-4 h-4" />
								{tab.label}
							</button>
						);
					})}
				</div>

				{/* Tab Content */}
				<div className="space-y-6">
					{/* Overview Tab */}
					{activeTab === "overview" && (
						<div className="space-y-6">
							<AutoPlanOverview
								plan={currentPlan}
								isLoading={isLoading}
							/>

							{currentPlan && (
								<div className="card bg-base-100 shadow-lg">
									<div className="card-body">
										<h3 className="card-title text-lg mb-4">
											Quick Actions
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<button
												className="btn btn-outline gap-2 justify-start"
												onClick={() =>
													setShowAdjustModal(true)
												}
											>
												<Plus className="w-5 h-5" />
												<div className="text-left">
													<div className="font-semibold">
														Adjust Plan
													</div>
													<div className="text-xs opacity-70">
														Modify volume, intensity
													</div>
												</div>
											</button>
											<button
												className="btn btn-outline gap-2 justify-start"
												onClick={
													handleTriggerProgression
												}
												disabled={isLoading}
											>
												<TrendingUp className="w-5 h-5" />
												<div className="text-left">
													<div className="font-semibold">
														Trigger Progression
													</div>
													<div className="text-xs opacity-70">
														Get suggestions
													</div>
												</div>
											</button>
											<button
												className="btn btn-outline gap-2 justify-start"
												onClick={() =>
													setActiveTab("adjustments")
												}
											>
												<History className="w-5 h-5" />
												<div className="text-left">
													<div className="font-semibold">
														View History
													</div>
													<div className="text-xs opacity-70">
														Past adjustments
													</div>
												</div>
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Progressions Tab */}
					{activeTab === "progressions" && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-2xl font-bold">
										Progression Suggestions
									</h2>
									<p className="text-base-content/70">
										AI-powered recommendations to advance
										your training
									</p>
								</div>
								<button
									className="btn btn-primary btn-sm gap-2"
									onClick={handleTriggerProgression}
									disabled={isLoading}
								>
									{isLoading ? (
										<span className="loading loading-spinner loading-sm"></span>
									) : (
										<TrendingUp className="w-4 h-4" />
									)}
									Generate New
								</button>
							</div>

							<ProgressionSuggestionList
								suggestions={
									currentPlan?.progressionSuggestions || []
								}
								onApply={handleApplyProgression}
								onDecline={handleDeclineProgression}
								applyingId={applyingProgressionId}
								isLoading={isLoading}
							/>
						</div>
					)}

					{/* Adjustments Tab */}
					{activeTab === "adjustments" && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-2xl font-bold">
										Adjustment History
									</h2>
									<p className="text-base-content/70">
										Timeline of all changes made to your
										plan
									</p>
								</div>
								<button
									className="btn btn-primary btn-sm gap-2"
									onClick={() => setShowAdjustModal(true)}
								>
									<Plus className="w-4 h-4" />
									New Adjustment
								</button>
							</div>

							<AdjustmentHistory
								adjustments={
									currentPlan?.adjustmentHistory || []
								}
								isLoading={isLoading}
							/>
						</div>
					)}

					{/* Settings Tab */}
					{activeTab === "settings" && (
						<div className="space-y-6">
							<div>
								<h2 className="text-2xl font-bold mb-2">
									Plan Settings
								</h2>
								<p className="text-base-content/70">
									Manage your auto-generated plan preferences
								</p>
							</div>

							{/* Plan Info Card */}
							{currentPlan && (
								<div className="card bg-base-100 shadow-lg">
									<div className="card-body">
										<h3 className="card-title">
											Plan Information
										</h3>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<div className="text-sm text-base-content/70">
													Plan ID
												</div>
												<div className="font-mono text-sm">
													{currentPlan.id?.slice(
														0,
														8
													)}
													...
												</div>
											</div>
											<div>
												<div className="text-sm text-base-content/70">
													Created
												</div>
												<div className="text-sm">
													{new Date(
														currentPlan.createdAt
													).toLocaleDateString()}
												</div>
											</div>
											<div>
												<div className="text-sm text-base-content/70">
													Status
												</div>
												<div className="badge badge-success">
													{currentPlan.status}
												</div>
											</div>
											<div>
												<div className="text-sm text-base-content/70">
													Last Updated
												</div>
												<div className="text-sm">
													{currentPlan.updatedAt
														? new Date(
																currentPlan.updatedAt
														  ).toLocaleDateString()
														: "Never"}
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Preferences Card */}
							<div className="card bg-base-100 shadow-lg">
								<div className="card-body">
									<h3 className="card-title mb-4">
										Preferences
									</h3>
									<div className="space-y-4">
										<div className="form-control">
											<label className="label cursor-pointer">
												<span className="label-text">
													Auto-apply progressions
												</span>
												<input
													type="checkbox"
													className="toggle toggle-primary"
													defaultChecked={false}
												/>
											</label>
											<p className="text-xs text-base-content/60 mt-1">
												Automatically apply AI
												suggestions without confirmation
											</p>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer">
												<span className="label-text">
													Weekly progression check
												</span>
												<input
													type="checkbox"
													className="toggle toggle-primary"
													defaultChecked={true}
												/>
											</label>
											<p className="text-xs text-base-content/60 mt-1">
												Check for progressions at the
												end of each week
											</p>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer">
												<span className="label-text">
													Email notifications
												</span>
												<input
													type="checkbox"
													className="toggle toggle-primary"
													defaultChecked={true}
												/>
											</label>
											<p className="text-xs text-base-content/60 mt-1">
												Get notified about plan updates
												and suggestions
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Danger Zone */}
							{currentPlan && (
								<div className="card bg-error/10 border border-error/20">
									<div className="card-body">
										<div className="flex items-start gap-3">
											<AlertTriangle className="w-5 h-5 text-error mt-0.5" />
											<div className="flex-1">
												<h3 className="font-bold text-error mb-2">
													Danger Zone
												</h3>
												<p className="text-sm text-base-content/70 mb-4">
													Deactivating your plan will
													stop all automatic
													progressions and
													adjustments. You can
													generate a new plan anytime.
												</p>
												<button
													className="btn btn-error btn-sm gap-2"
													onClick={() =>
														setShowDeactivateModal(
															true
														)
													}
												>
													<Power className="w-4 h-4" />
													Deactivate Plan
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Adjust Plan Modal */}
			<AdjustPlanModal
				isOpen={showAdjustModal}
				onClose={() => setShowAdjustModal(false)}
				onSave={handleAdjustPlan}
				currentPlan={currentPlan}
				isSaving={isLoading}
			/>

			{/* Deactivate Confirmation Modal */}
			{showDeactivateModal && (
				<div className="modal modal-open">
					<div className="modal-box">
						<h3 className="font-bold text-lg mb-4">
							Deactivate Plan?
						</h3>
						<p className="mb-6">
							Are you sure you want to deactivate your
							auto-generated plan? This action cannot be undone,
							but you can generate a new plan anytime.
						</p>
						<div className="modal-action">
							<button
								className="btn btn-ghost"
								onClick={() => setShowDeactivateModal(false)}
								disabled={isLoading}
							>
								Cancel
							</button>
							<button
								className="btn btn-error gap-2"
								onClick={handleDeactivatePlan}
								disabled={isLoading}
							>
								{isLoading ? (
									<span className="loading loading-spinner loading-sm"></span>
								) : (
									<Power className="w-4 h-4" />
								)}
								Deactivate
							</button>
						</div>
					</div>
				</div>
			)}
		</PageContainer>
	);
};

export default AutoPlanDashboard;
