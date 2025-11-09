import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAutoPlanStore } from "../store/autoPlan/autoPlanStore";
import { useAuthStore } from "../store/auth/authStore";
import toast from "react-hot-toast";
import {
	Target,
	Dumbbell,
	Clock,
	Zap,
	Calendar,
	TrendingUp,
	ArrowLeft,
	Check,
} from "lucide-react";

const GeneratePlan = () => {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { generateAutoPlan, isLoading } = useAutoPlanStore();

	const [formData, setFormData] = useState({
		goals: [],
		experience_level: "beginner",
		days_per_week: 3,
		session_length_minutes: 45,
		equipment: [],
	});

	useEffect(() => {
		// Pre-fill from user profile if available
		if (user?.profile) {
			setFormData((prev) => ({
				...prev,
				goals: user.profile.goals || [],
				experience_level: user.profile.experience_level || "beginner",
				days_per_week: user.profile.days_per_week || 3,
				session_length_minutes:
					user.profile.session_length_minutes || 45,
				equipment: user.profile.equipment || [],
			}));
		}
	}, [user]);

	const goalOptions = [
		{
			value: "strength",
			label: "Build Strength",
			icon: <Dumbbell className="w-5 h-5" />,
		},
		{
			value: "hypertrophy",
			label: "Muscle Growth",
			icon: <TrendingUp className="w-5 h-5" />,
		},
		{
			value: "fat_loss",
			label: "Fat Loss",
			icon: <Target className="w-5 h-5" />,
		},
		{
			value: "endurance",
			label: "Endurance",
			icon: <Zap className="w-5 h-5" />,
		},
		{
			value: "general_fitness",
			label: "General Fitness",
			icon: <Calendar className="w-5 h-5" />,
		},
	];

	const experienceLevels = [
		{
			value: "beginner",
			label: "Beginner",
			desc: "New to structured training",
		},
		{
			value: "intermediate",
			label: "Intermediate",
			desc: "1-2 years of training",
		},
		{ value: "advanced", label: "Advanced", desc: "3+ years of training" },
	];

	const equipmentOptions = [
		"barbell",
		"dumbbell",
		"kettlebell",
		"resistance_band",
		"pull_up_bar",
		"bench",
		"squat_rack",
		"cable_machine",
		"bodyweight",
		"none",
	];

	const handleGoalToggle = (goal) => {
		setFormData((prev) => {
			const goals = prev.goals.includes(goal)
				? prev.goals.filter((g) => g !== goal)
				: [...prev.goals, goal];
			return { ...prev, goals };
		});
	};

	const handleEquipmentToggle = (equipment) => {
		setFormData((prev) => {
			const equipmentList = prev.equipment.includes(equipment)
				? prev.equipment.filter((e) => e !== equipment)
				: [...prev.equipment, equipment];
			return { ...prev, equipment: equipmentList };
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation
		if (formData.goals.length === 0) {
			toast.error("Please select at least one goal");
			return;
		}

		if (formData.equipment.length === 0) {
			toast.error("Please select available equipment");
			return;
		}

		// Generate plan
		const result = await generateAutoPlan(formData);

		if (result.success) {
			toast.success("Custom plan generated successfully! 🎉");
			navigate("/dashboard");
		} else {
			toast.error(result.message || "Failed to generate plan");
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<button
				onClick={() => navigate("/dashboard")}
				className="btn btn-ghost btn-sm mb-4 gap-2"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Dashboard
			</button>

			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<div className="mb-6">
						<h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
							<span>✨</span>
							Generate Custom Plan
						</h1>
						<p className="text-base-content/70">
							Create a personalized workout plan tailored to your
							goals and preferences
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Goals Section */}
						<div>
							<label className="label">
								<span className="label-text text-lg font-semibold flex items-center gap-2">
									<Target className="w-5 h-5" />
									Fitness Goals
								</span>
							</label>
							<p className="text-sm text-base-content/70 mb-3">
								Select one or more goals (required)
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{goalOptions.map((goal) => (
									<button
										key={goal.value}
										type="button"
										onClick={() =>
											handleGoalToggle(goal.value)
										}
										className={`btn justify-start gap-3 ${
											formData.goals.includes(goal.value)
												? "btn-primary"
												: "btn-outline"
										}`}
									>
										{goal.icon}
										<span>{goal.label}</span>
										{formData.goals.includes(
											goal.value
										) && (
											<Check className="w-4 h-4 ml-auto" />
										)}
									</button>
								))}
							</div>
						</div>

						{/* Experience Level */}
						<div>
							<label className="label">
								<span className="label-text text-lg font-semibold flex items-center gap-2">
									<TrendingUp className="w-5 h-5" />
									Experience Level
								</span>
							</label>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								{experienceLevels.map((level) => (
									<button
										key={level.value}
										type="button"
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												experience_level: level.value,
											}))
										}
										className={`btn btn-outline flex-col h-auto py-4 ${
											formData.experience_level ===
											level.value
												? "btn-active"
												: ""
										}`}
									>
										<span className="font-semibold">
											{level.label}
										</span>
										<span className="text-xs opacity-70">
											{level.desc}
										</span>
									</button>
								))}
							</div>
						</div>

						{/* Days Per Week */}
						<div>
							<label className="label">
								<span className="label-text text-lg font-semibold flex items-center gap-2">
									<Calendar className="w-5 h-5" />
									Days Per Week
								</span>
							</label>
							<input
								type="range"
								min="3"
								max="6"
								value={formData.days_per_week}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										days_per_week: parseInt(e.target.value),
									}))
								}
								className="range range-primary"
								step="1"
							/>
							<div className="w-full flex justify-between text-xs px-2 mt-2">
								<span>3 days</span>
								<span>4 days</span>
								<span>5 days</span>
								<span>6 days</span>
							</div>
							<div className="text-center mt-3">
								<span className="badge badge-primary badge-lg">
									{formData.days_per_week} days per week
								</span>
							</div>
						</div>

						{/* Session Length */}
						<div>
							<label className="label">
								<span className="label-text text-lg font-semibold flex items-center gap-2">
									<Clock className="w-5 h-5" />
									Session Length
								</span>
							</label>
							<div className="flex gap-2">
								{[30, 45, 60, 90].map((minutes) => (
									<button
										key={minutes}
										type="button"
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												session_length_minutes: minutes,
											}))
										}
										className={`btn flex-1 ${
											formData.session_length_minutes ===
											minutes
												? "btn-primary"
												: "btn-outline"
										}`}
									>
										{minutes} min
									</button>
								))}
							</div>
						</div>

						{/* Equipment */}
						<div>
							<label className="label">
								<span className="label-text text-lg font-semibold flex items-center gap-2">
									<Dumbbell className="w-5 h-5" />
									Available Equipment
								</span>
							</label>
							<p className="text-sm text-base-content/70 mb-3">
								Select all that apply (required)
							</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{equipmentOptions.map((equipment) => (
									<button
										key={equipment}
										type="button"
										onClick={() =>
											handleEquipmentToggle(equipment)
										}
										className={`btn btn-sm justify-start ${
											formData.equipment.includes(
												equipment
											)
												? "btn-primary"
												: "btn-outline"
										}`}
									>
										{formData.equipment.includes(
											equipment
										) && <Check className="w-3 h-3" />}
										<span className="capitalize">
											{equipment.replace("_", " ")}
										</span>
									</button>
								))}
							</div>
						</div>

						{/* Submit Button */}
						<div className="card-actions justify-end pt-6">
							<button
								type="button"
								className="btn btn-ghost"
								onClick={() => navigate("/dashboard")}
								disabled={isLoading}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary btn-lg gap-2"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<span className="loading loading-spinner loading-sm"></span>
										Generating...
									</>
								) : (
									<>
										<Zap className="w-5 h-5" />
										Generate Plan
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default GeneratePlan;
