import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Sparkles,
	Target,
	Dumbbell,
	Clock,
	AlertCircle,
	ArrowLeft,
} from "lucide-react";
import { useAutoPlanStore } from "../store/autoPlan/autoPlanStore";
import PageContainer from "../components/PageContainer";
import toast from "react-hot-toast";

const AutoPlanGenerator = () => {
	const navigate = useNavigate();
	const { generateAutoPlan, getCurrentAutoPlan, isLoading } =
		useAutoPlanStore();
	const [formData, setFormData] = useState({
		goal: "muscle_gain",
		experience_level: "beginner",
		equipment: [],
		days_per_week: 3,
		preferred_days: [],
		session_length_minutes: 45,
		injuries: "",
		focus_areas: [],
	});
	const [errors, setErrors] = useState({});

	// Check if user already has an active plan
	useEffect(() => {
		checkExistingPlan();
	}, []);

	const checkExistingPlan = async () => {
		const result = await getCurrentAutoPlan();
		if (result.success && result.data) {
			toast("You already have an active plan", {
				icon: "ℹ️",
			});
			navigate("/auto-plan/dashboard");
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.goal) {
			newErrors.goal = "Please select a fitness goal";
		}

		if (!formData.experience_level) {
			newErrors.experience_level = "Please select your experience level";
		}

		if (formData.equipment.length === 0) {
			newErrors.equipment = "Please select at least one equipment option";
		}

		if (formData.focus_areas.length === 0) {
			newErrors.focus_areas = "Please select at least one focus area";
		}

		if (formData.preferred_days.length > 0 && formData.preferred_days.length < formData.days_per_week) {
			newErrors.preferred_days = `Please select at least ${formData.days_per_week} days or leave it empty`;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Please fill in all required fields");
			return;
		}

		console.log('=== FRONTEND SUBMITTING ===');
		console.log('Form Data:', formData);
		console.log('Goal:', formData.goal);

		const result = await generateAutoPlan(formData);
		if (result.success) {
			toast.success("Plan generated successfully!");
			navigate("/auto-plan/dashboard");
		} else {
			toast.error(result.message || "Failed to generate plan");
		}
	};

	const toggleArrayItem = (field, value) => {
		const currentArray = formData[field];
		const newArray = currentArray.includes(value)
			? currentArray.filter((item) => item !== value)
			: [...currentArray, value];
		setFormData({ ...formData, [field]: newArray });
		// Clear error when user makes selection
		if (errors[field]) {
			setErrors({ ...errors, [field]: null });
		}
	};

	return (
		<PageContainer maxWidth="4xl">
			<div className="flex flex-col gap-6">
				{/* Header */}
				<div className="flex items-center gap-4">
					<button
						className="btn btn-circle btn-ghost"
						onClick={() => navigate("/dashboard")}
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-2">
							<Sparkles className="w-8 h-8 text-primary" />
							Generate Your AI Plan
						</h1>
						<p className="text-base-content/70">
							Answer a few questions to create a personalized
							workout plan
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Fitness Goal */}
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<div className="flex items-center gap-2 mb-4">
								<Target className="w-5 h-5 text-primary" />
								<h2 className="card-title">
									Your Fitness Goal
								</h2>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">
										What's your primary goal? *
									</span>
								</label>
								<select
									className={`select select-bordered ${
										errors.goal ? "select-error" : ""
									}`}
									value={formData.goal}
									onChange={(e) => {
										setFormData({
											...formData,
											goal: e.target.value,
										});
										setErrors({ ...errors, goal: null });
									}}
								>
									<option value="">Select a goal</option>
									<option value="muscle_gain">
										Build Muscle
									</option>
									<option value="fat_loss">Lose Fat</option>
									<option value="strength">
										Increase Strength
									</option>
									<option value="endurance">
										Improve Endurance
									</option>
									<option value="general_fitness">
										General Fitness
									</option>
								</select>
								{errors.goal && (
									<label className="label">
										<span className="label-text-alt text-error">
											{errors.goal}
										</span>
									</label>
								)}
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">
										Experience Level *
									</span>
								</label>
								<select
									className={`select select-bordered ${
										errors.experience_level
											? "select-error"
											: ""
									}`}
									value={formData.experience_level}
									onChange={(e) => {
										setFormData({
											...formData,
											experience_level: e.target.value,
										});
										setErrors({
											...errors,
											experience_level: null,
										});
									}}
								>
									<option value="beginner">
										Beginner (0-1 years)
									</option>
									<option value="intermediate">
										Intermediate (1-3 years)
									</option>
									<option value="advanced">
										Advanced (3+ years)
									</option>
								</select>
							</div>
						</div>
					</div>

					{/* Workout Preferences */}
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<div className="flex items-center gap-2 mb-4">
								<Dumbbell className="w-5 h-5 text-primary" />
								<h2 className="card-title">
									Workout Preferences
								</h2>
							</div>

							{/* Equipment */}
							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">
										Available Equipment *
									</span>
								</label>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
									{[
										{
											value: "bodyweight",
											label: "Bodyweight",
										},
										{
											value: "dumbbells",
											label: "Dumbbells",
										},
										{ value: "barbell", label: "Barbell" },
										{
											value: "machines",
											label: "Machines",
										},
										{
											value: "resistance_bands",
											label: "Resistance Bands",
										},
										{
											value: "full_gym",
											label: "Full Gym Access",
										},
									].map((item) => (
										<label
											key={item.value}
											className={`btn btn-sm ${
												formData.equipment.includes(
													item.value
												)
													? "btn-primary"
													: "btn-outline"
											}`}
										>
											<input
												type="checkbox"
												className="hidden"
												checked={formData.equipment.includes(
													item.value
												)}
												onChange={() =>
													toggleArrayItem(
														"equipment",
														item.value
													)
												}
											/>
											{item.label}
										</label>
									))}
								</div>
								{errors.equipment && (
									<label className="label">
										<span className="label-text-alt text-error">
											{errors.equipment}
										</span>
									</label>
								)}
							</div>

							{/* Focus Areas */}
							<div className="form-control mt-4">
								<label className="label">
									<span className="label-text font-semibold">
										Focus Areas *
									</span>
								</label>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
									{[
										{ value: "chest", label: "Chest" },
										{ value: "back", label: "Back" },
										{ value: "legs", label: "Legs" },
										{
											value: "shoulders",
											label: "Shoulders",
										},
										{ value: "arms", label: "Arms" },
										{ value: "core", label: "Core" },
									].map((item) => (
										<label
											key={item.value}
											className={`btn btn-sm ${
												formData.focus_areas.includes(
													item.value
												)
													? "btn-secondary"
													: "btn-outline"
											}`}
										>
											<input
												type="checkbox"
												className="hidden"
												checked={formData.focus_areas.includes(
													item.value
												)}
												onChange={() =>
													toggleArrayItem(
														"focus_areas",
														item.value
													)
												}
											/>
											{item.label}
										</label>
									))}
								</div>
								{errors.focus_areas && (
									<label className="label">
										<span className="label-text-alt text-error">
											{errors.focus_areas}
										</span>
									</label>
								)}
							</div>
						</div>
					</div>

					{/* Schedule */}
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<div className="flex items-center gap-2 mb-4">
								<Clock className="w-5 h-5 text-primary" />
								<h2 className="card-title">Your Schedule</h2>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">
										Days Per Week
									</span>
								</label>
								<input
									type="range"
									min="2"
									max="6"
									value={formData.days_per_week}
									className="range range-primary"
									step="1"
									onChange={(e) =>
										setFormData({
											...formData,
											days_per_week: parseInt(
												e.target.value
											),
										})
									}
								/>
								<div className="flex justify-between text-xs px-2 mt-2">
									<span>2</span>
									<span>3</span>
									<span>4</span>
									<span>5</span>
									<span>6</span>
								</div>
								<p className="text-sm text-center mt-2 font-semibold">
									{formData.days_per_week} days per week
								</p>
							</div>

							{/* Preferred Days Selection */}
							<div className="form-control mt-6">
								<label className="label">
									<span className="label-text font-semibold">
										Preferred Workout Days (Optional)
									</span>
								</label>
								<p className="text-sm text-base-content/70 mb-3">
									Select {formData.days_per_week} or more days when you prefer to workout
								</p>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
									{[
										{ value: "monday", label: "Monday" },
										{ value: "tuesday", label: "Tuesday" },
										{ value: "wednesday", label: "Wednesday" },
										{ value: "thursday", label: "Thursday" },
										{ value: "friday", label: "Friday" },
										{ value: "saturday", label: "Saturday" },
										{ value: "sunday", label: "Sunday" },
									].map((day) => (
										<label
											key={day.value}
											className={`btn btn-sm ${
												formData.preferred_days.includes(
													day.value
												)
													? "btn-primary"
													: "btn-outline"
											}`}
										>
											<input
												type="checkbox"
												className="hidden"
												checked={formData.preferred_days.includes(
													day.value
												)}
												onChange={() =>
													toggleArrayItem(
														"preferred_days",
														day.value
													)
												}
											/>
											{day.label}
										</label>
									))}
								</div>
								{formData.preferred_days.length > 0 && (
									<p className="text-sm text-center mt-2 text-base-content/70">
										{formData.preferred_days.length} days selected
									</p>
								)}
								{errors.preferred_days && (
									<label className="label">
										<span className="label-text-alt text-error">
											{errors.preferred_days}
										</span>
									</label>
								)}
							</div>

							<div className="form-control mt-4">
								<label className="label">
									<span className="label-text font-semibold">
										Session Length (minutes)
									</span>
								</label>
								<input
									type="range"
									min="30"
									max="120"
									value={formData.session_length_minutes}
									className="range range-secondary"
									step="15"
									onChange={(e) =>
										setFormData({
											...formData,
											session_length_minutes: parseInt(
												e.target.value
											),
										})
									}
								/>
								<div className="flex justify-between text-xs px-2 mt-2">
									<span>30</span>
									<span>60</span>
									<span>90</span>
									<span>120</span>
								</div>
								<p className="text-sm text-center mt-2 font-semibold">
									{formData.session_length_minutes} minutes
								</p>
							</div>
						</div>
					</div>

					{/* Additional Information */}
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<div className="flex items-center gap-2 mb-4">
								<AlertCircle className="w-5 h-5 text-primary" />
								<h2 className="card-title">
									Additional Information
								</h2>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">
										Injuries or Limitations (Optional)
									</span>
								</label>
								<textarea
									className="textarea textarea-bordered h-24"
									placeholder="Tell us about any injuries, mobility issues, or exercises you need to avoid..."
									value={formData.injuries}
									onChange={(e) =>
										setFormData({
											...formData,
											injuries: e.target.value,
										})
									}
								></textarea>
								<label className="label">
									<span className="label-text-alt">
										This helps us customize your plan safely
									</span>
								</label>
							</div>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="btn btn-primary btn-lg w-full gap-2"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<span className="loading loading-spinner"></span>
								Generating Your Plan...
							</>
						) : (
							<>
								<Sparkles className="w-5 h-5" />
								Generate My AI Plan
							</>
						)}
					</button>

					<p className="text-center text-sm text-base-content/60">
						* Required fields
					</p>
				</form>
			</div>
		</PageContainer>
	);
};

export default AutoPlanGenerator;
