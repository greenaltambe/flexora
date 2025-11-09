import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import exerciseStore from "../store/exercise/exerciseStore";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

const CreateEditExercise = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { createExercise, updateExercise, getExerciseById } = exerciseStore();
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		type: "strength",
		primary_muscles: [],
		secondary_muscles: [],
		movement_patterns: [],
		equipment: [],
		tags: [],
		difficulty: 3,
		modality: "reps",
		default_prescription: {
			sets: 3,
			reps: 10,
			rest_seconds: 60,
		},
		estimated_minutes: 5,
		contraindications: [],
		video_url: "",
		published: false,
	});

	const [tempPrimaryMuscle, setTempPrimaryMuscle] = useState("");
	const [tempEquipment, setTempEquipment] = useState("");
	const [tempTag, setTempTag] = useState("");
	const [tempSecondaryMuscle, setTempSecondaryMuscle] = useState("");
	const [tempMovementPattern, setTempMovementPattern] = useState("");
	const [tempContraindication, setTempContraindication] = useState("");

	useEffect(() => {
		if (id) {
			setIsFetching(true);
			getExerciseById(id).then((result) => {
				setIsFetching(false);
				if (result.success && result.data) {
					setFormData({
						name: result.data.name || "",
						description: result.data.description || "",
						type: result.data.type || "strength",
						primary_muscles: result.data.primary_muscles || [],
						secondary_muscles: result.data.secondary_muscles || [],
						movement_patterns: result.data.movement_patterns || [],
						equipment: result.data.equipment || [],
						tags: result.data.tags || [],
						difficulty: result.data.difficulty || 3,
						modality: result.data.modality || "reps",
						default_prescription: result.data
							.default_prescription || {
							sets: 3,
							reps: 10,
							rest_seconds: 60,
						},
						estimated_minutes: result.data.estimated_minutes || 5,
						contraindications: result.data.contraindications || [],
						video_url: result.data.video_url || "",
						published: result.data.published || false,
					});
				} else {
					toast.error(result.message);
					navigate("/admin/manage-exercise");
				}
			});
		}
	}, [id, getExerciseById, navigate]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handlePrescriptionChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			default_prescription: {
				...prev.default_prescription,
				[field]: value,
			},
		}));
	};

	const handleAddArrayItem = (field, value) => {
		if (!value.trim()) return;
		setFormData((prev) => ({
			...prev,
			[field]: [...prev[field], value.trim()],
		}));
	};

	const handleRemoveArrayItem = (field, index) => {
		setFormData((prev) => ({
			...prev,
			[field]: prev[field].filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const result = id
			? await updateExercise(id, formData)
			: await createExercise(formData);

		setIsLoading(false);

		if (result.success) {
			toast.success(result.message);
			navigate("/admin/manage-exercise");
		} else {
			toast.error(result.message);
		}
	};

	if (isFetching) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-base-100">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-base-100 p-6">
			<div className="container mx-auto max-w-3xl">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-base-content">
						{id ? "Edit Exercise" : "Create New Exercise"}
					</h1>
					<button
						type="button"
						onClick={() => navigate("/admin/manage-exercise")}
						className="btn btn-ghost gap-2"
					>
						<ArrowLeft className="w-5 h-5" />
						Back to Exercises
					</button>
				</div>

				<div className="card bg-base-100 shadow-lg border border-base-200">
					<div className="card-body p-8">
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Basic Information */}
							<div className="space-y-6">
								<h2 className="text-2xl font-semibold text-base-content">
									Basic Information
								</h2>
								<div className="form-control space-y-2">
									<label className="label">
										<span className="label-text font-medium text-base-content">
											Name{" "}
											<span className="text-error">
												*
											</span>
										</span>
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										className="input input-bordered w-full focus:input-primary"
										required
									/>
								</div>

								<div className="form-control space-y-2">
									<label className="label">
										<span className="label-text font-medium text-base-content">
											Description
										</span>
									</label>
									<textarea
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										className="textarea textarea-bordered w-full focus:textarea-primary"
										rows="4"
										placeholder="Enter exercise description..."
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="form-control space-y-2">
										<label className="label">
											<span className="label-text font-medium text-base-content">
												Type
											</span>
										</label>
										<select
											name="type"
											value={formData.type}
											onChange={handleInputChange}
											className="select select-bordered w-full focus:select-primary"
										>
											<option value="strength">
												Strength
											</option>
											<option value="cardio">
												Cardio
											</option>
											<option value="mobility">
												Mobility
											</option>
											<option value="skill">Skill</option>
											<option value="hybrid">
												Hybrid
											</option>
										</select>
									</div>

									<div className="form-control space-y-2">
										<label className="label">
											<span className="label-text font-medium text-base-content">
												Modality
											</span>
										</label>
										<select
											name="modality"
											value={formData.modality}
											onChange={handleInputChange}
											className="select select-bordered w-full focus:select-primary"
										>
											<option value="reps">Reps</option>
											<option value="time">Time</option>
											<option value="distance">
												Distance
											</option>
											<option value="interval">
												Interval
											</option>
											<option value="rpm">RPM</option>
										</select>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="form-control space-y-2">
										<label className="label">
											<span className="label-text font-medium text-base-content">
												Difficulty
											</span>
										</label>
										<input
											type="range"
											name="difficulty"
											min="1"
											max="5"
											value={formData.difficulty}
											onChange={handleInputChange}
											className="range range-primary range-md"
										/>
										<div className="flex justify-between text-xs text-base-content mt-2">
											<span>1</span>
											<span>2</span>
											<span>3</span>
											<span>4</span>
											<span>5</span>
										</div>
										<div className="text-center mt-3">
											<span className="badge badge-primary badge-md font-medium">
												Level {formData.difficulty}
											</span>
										</div>
									</div>

									<div className="form-control space-y-2">
										<label className="label">
											<span className="label-text font-medium text-base-content">
												Estimated Minutes
											</span>
										</label>
										<input
											type="number"
											name="estimated_minutes"
											value={formData.estimated_minutes}
											onChange={handleInputChange}
											className="input input-bordered w-full focus:input-primary"
											min="1"
										/>
									</div>
								</div>

								<div className="form-control space-y-2">
									<label className="label">
										<span className="label-text font-medium text-base-content">
											Video URL
										</span>
									</label>
									<input
										type="url"
										name="video_url"
										value={formData.video_url}
										onChange={handleInputChange}
										className="input input-bordered w-full focus:input-primary"
										placeholder="https://example.com/video"
									/>
								</div>

								<div className="form-control flex-row items-center space-x-4">
									<label className="label cursor-pointer">
										<span className="label-text font-medium text-base-content">
											Published
										</span>
									</label>
									<input
										type="checkbox"
										name="published"
										checked={formData.published}
										onChange={handleInputChange}
										className="toggle toggle-primary toggle-md"
									/>
								</div>
							</div>

							{/* Primary Muscles */}
							<div className="divider divider-neutral"></div>
							<div className="space-y-4">
								<h2 className="text-2xl font-semibold text-base-content flex items-center gap-2">
									<span>💪</span> Primary Muscles
								</h2>
								<p className="text-sm text-base-content/70">
									Main muscles targeted by this exercise
								</p>
								<div className="flex gap-3">
									<input
										type="text"
										value={tempPrimaryMuscle}
										onChange={(e) =>
											setTempPrimaryMuscle(e.target.value)
										}
										className="input input-bordered w-full focus:input-primary"
										placeholder="e.g., Chest, Quadriceps, Biceps"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddArrayItem(
													"primary_muscles",
													tempPrimaryMuscle
												);
												setTempPrimaryMuscle("");
											}
										}}
									/>
									<button
										type="button"
										onClick={() => {
											handleAddArrayItem(
												"primary_muscles",
												tempPrimaryMuscle
											);
											setTempPrimaryMuscle("");
										}}
										className="btn btn-primary btn-md px-6"
									>
										Add
									</button>
								</div>
								<div className="flex flex-wrap gap-2 min-h-12 p-3 bg-base-200 rounded-lg">
									{formData.primary_muscles.length === 0 ? (
										<span className="text-base-content/50 text-sm">
											No primary muscles added yet
										</span>
									) : (
										formData.primary_muscles.map(
											(muscle, index) => (
												<span
													key={index}
													className="badge badge-primary badge-lg font-medium gap-2"
												>
													{muscle}
													<button
														type="button"
														onClick={() =>
															handleRemoveArrayItem(
																"primary_muscles",
																index
															)
														}
														className="hover:text-error"
													>
														×
													</button>
												</span>
											)
										)
									)}
								</div>
							</div>

							{/* Secondary Muscles */}
							<div className="divider divider-neutral"></div>
							<div className="space-y-4">
								<h2 className="text-2xl font-semibold text-base-content flex items-center gap-2">
									<span>🎯</span> Secondary Muscles
								</h2>
								<p className="text-sm text-base-content/70">
									Supporting muscles engaged during this
									exercise
								</p>
								<div className="flex gap-3">
									<input
										type="text"
										value={tempSecondaryMuscle}
										onChange={(e) =>
											setTempSecondaryMuscle(
												e.target.value
											)
										}
										className="input input-bordered w-full focus:input-primary"
										placeholder="e.g., Triceps, Core, Shoulders"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddArrayItem(
													"secondary_muscles",
													tempSecondaryMuscle
												);
												setTempSecondaryMuscle("");
											}
										}}
									/>
									<button
										type="button"
										onClick={() => {
											handleAddArrayItem(
												"secondary_muscles",
												tempSecondaryMuscle
											);
											setTempSecondaryMuscle("");
										}}
										className="btn btn-secondary btn-md px-6"
									>
										Add
									</button>
								</div>
								<div className="flex flex-wrap gap-2 min-h-12 p-3 bg-base-200 rounded-lg">
									{formData.secondary_muscles.length === 0 ? (
										<span className="text-base-content/50 text-sm">
											No secondary muscles added yet
										</span>
									) : (
										formData.secondary_muscles.map(
											(muscle, index) => (
												<span
													key={index}
													className="badge badge-secondary badge-lg font-medium gap-2"
												>
													{muscle}
													<button
														type="button"
														onClick={() =>
															handleRemoveArrayItem(
																"secondary_muscles",
																index
															)
														}
														className="hover:text-error"
													>
														×
													</button>
												</span>
											)
										)
									)}
								</div>
							</div>

							{/* Movement Patterns */}
							<div className="divider divider-neutral"></div>
							<div className="space-y-4">
								<h2 className="text-2xl font-semibold text-base-content flex items-center gap-2">
									<span>🔄</span> Movement Patterns
								</h2>
								<p className="text-sm text-base-content/70">
									Type of movement (e.g., Push, Pull, Hinge,
									Squat)
								</p>
								<div className="flex gap-3">
									<input
										type="text"
										value={tempMovementPattern}
										onChange={(e) =>
											setTempMovementPattern(
												e.target.value
											)
										}
										className="input input-bordered w-full focus:input-primary"
										placeholder="e.g., Push, Pull, Hinge, Squat"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddArrayItem(
													"movement_patterns",
													tempMovementPattern
												);
												setTempMovementPattern("");
											}
										}}
									/>
									<button
										type="button"
										onClick={() => {
											handleAddArrayItem(
												"movement_patterns",
												tempMovementPattern
											);
											setTempMovementPattern("");
										}}
										className="btn btn-accent btn-md px-6"
									>
										Add
									</button>
								</div>
								<div className="flex flex-wrap gap-2 min-h-12 p-3 bg-base-200 rounded-lg">
									{formData.movement_patterns.length === 0 ? (
										<span className="text-base-content/50 text-sm">
											No movement patterns added yet
										</span>
									) : (
										formData.movement_patterns.map(
											(pattern, index) => (
												<span
													key={index}
													className="badge badge-accent badge-lg font-medium gap-2"
												>
													{pattern}
													<button
														type="button"
														onClick={() =>
															handleRemoveArrayItem(
																"movement_patterns",
																index
															)
														}
														className="hover:text-error"
													>
														×
													</button>
												</span>
											)
										)
									)}
								</div>
							</div>

							{/* Equipment */}
							<div className="divider divider-neutral"></div>
							<div className="space-y-4">
								<h2 className="text-2xl font-semibold text-base-content flex items-center gap-2">
									<span>🏋️</span> Equipment
								</h2>
								<p className="text-sm text-base-content/70">
									Equipment required for this exercise
								</p>
								<div className="flex gap-3">
									<input
										type="text"
										value={tempEquipment}
										onChange={(e) =>
											setTempEquipment(e.target.value)
										}
										className="input input-bordered w-full focus:input-primary"
										placeholder="e.g., Dumbbell, Barbell, Bodyweight, Kettlebell"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddArrayItem(
													"equipment",
													tempEquipment
												);
												setTempEquipment("");
											}
										}}
									/>
									<button
										type="button"
										onClick={() => {
											handleAddArrayItem(
												"equipment",
												tempEquipment
											);
											setTempEquipment("");
										}}
										className="btn btn-info btn-md px-6"
									>
										Add
									</button>
								</div>
								<div className="flex flex-wrap gap-2 min-h-12 p-3 bg-base-200 rounded-lg">
									{formData.equipment.length === 0 ? (
										<span className="text-base-content/50 text-sm">
											No equipment added yet
										</span>
									) : (
										formData.equipment.map((eq, index) => (
											<span
												key={index}
												className="badge badge-info badge-lg font-medium gap-2"
											>
												{eq}
												<button
													type="button"
													onClick={() =>
														handleRemoveArrayItem(
															"equipment",
															index
														)
													}
													className="hover:text-error"
												>
													×
												</button>
											</span>
										))
									)}
								</div>
							</div>

							{/* Tags */}
							<div className="divider divider-neutral"></div>
							<div className="space-y-4">
								<h2 className="text-2xl font-semibold text-base-content flex items-center gap-2">
									<span>🏷️</span> Tags
								</h2>
								<p className="text-sm text-base-content/70">
									Keywords to help categorize and search for
									this exercise
								</p>
								<div className="flex gap-3">
									<input
										type="text"
										value={tempTag}
										onChange={(e) =>
											setTempTag(e.target.value)
										}
										className="input input-bordered w-full focus:input-primary"
										placeholder="e.g., upper-body, beginner, compound"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddArrayItem(
													"tags",
													tempTag
												);
												setTempTag("");
											}
										}}
									/>
									<button
										type="button"
										onClick={() => {
											handleAddArrayItem("tags", tempTag);
											setTempTag("");
										}}
										className="btn btn-success btn-md px-6"
									>
										Add
									</button>
								</div>
								<div className="flex flex-wrap gap-2 min-h-12 p-3 bg-base-200 rounded-lg">
									{formData.tags.length === 0 ? (
										<span className="text-base-content/50 text-sm">
											No tags added yet
										</span>
									) : (
										formData.tags.map((tag, index) => (
											<span
												key={index}
												className="badge badge-success badge-lg font-medium gap-2"
											>
												{tag}
												<button
													type="button"
													onClick={() =>
														handleRemoveArrayItem(
															"tags",
															index
														)
													}
													className="hover:text-error"
												>
													×
												</button>
											</span>
										))
									)}
								</div>
							</div>

							{/* Contraindications */}
							<div className="divider divider-neutral"></div>
							<div className="space-y-4">
								<h2 className="text-2xl font-semibold text-base-content flex items-center gap-2">
									<span>⚠️</span> Contraindications
								</h2>
								<p className="text-sm text-base-content/70">
									Conditions or situations where this exercise
									should be avoided
								</p>
								<div className="flex gap-3">
									<input
										type="text"
										value={tempContraindication}
										onChange={(e) =>
											setTempContraindication(
												e.target.value
											)
										}
										className="input input-bordered w-full focus:input-primary"
										placeholder="e.g., Lower back injury, Shoulder pain"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddArrayItem(
													"contraindications",
													tempContraindication
												);
												setTempContraindication("");
											}
										}}
									/>
									<button
										type="button"
										onClick={() => {
											handleAddArrayItem(
												"contraindications",
												tempContraindication
											);
											setTempContraindication("");
										}}
										className="btn btn-warning btn-md px-6"
									>
										Add
									</button>
								</div>
								<div className="flex flex-wrap gap-2 min-h-12 p-3 bg-base-200 rounded-lg">
									{formData.contraindications.length === 0 ? (
										<span className="text-base-content/50 text-sm">
											No contraindications added yet
										</span>
									) : (
										formData.contraindications.map(
											(item, index) => (
												<span
													key={index}
													className="badge badge-warning badge-lg font-medium gap-2"
												>
													{item}
													<button
														type="button"
														onClick={() =>
															handleRemoveArrayItem(
																"contraindications",
																index
															)
														}
														className="hover:text-error"
													>
														×
													</button>
												</span>
											)
										)
									)}
								</div>
							</div>

							{/* Default Prescription */}
							<div className="divider divider-neutral"></div>
							<div className="space-y-4">
								<h2 className="text-2xl font-semibold text-base-content flex items-center gap-2">
									<span>💊</span> Default Prescription
								</h2>
								<p className="text-sm text-base-content/70">
									Recommended sets, reps, and rest time for
									this exercise
								</p>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="form-control space-y-2">
										<label className="label">
											<span className="label-text font-medium text-base-content">
												Sets
											</span>
										</label>
										<input
											type="number"
											value={
												formData.default_prescription
													.sets
											}
											onChange={(e) =>
												handlePrescriptionChange(
													"sets",
													parseInt(e.target.value)
												)
											}
											className="input input-bordered w-full focus:input-primary"
											min="1"
										/>
									</div>
									<div className="form-control space-y-2">
										<label className="label">
											<span className="label-text font-medium text-base-content">
												Reps
											</span>
										</label>
										<input
											type="number"
											value={
												formData.default_prescription
													.reps
											}
											onChange={(e) =>
												handlePrescriptionChange(
													"reps",
													parseInt(e.target.value)
												)
											}
											className="input input-bordered w-full focus:input-primary"
											min="1"
										/>
									</div>
									<div className="form-control space-y-2">
										<label className="label">
											<span className="label-text font-medium text-base-content">
												Rest (seconds)
											</span>
										</label>
										<input
											type="number"
											value={
												formData.default_prescription
													.rest_seconds
											}
											onChange={(e) =>
												handlePrescriptionChange(
													"rest_seconds",
													parseInt(e.target.value)
												)
											}
											className="input input-bordered w-full focus:input-primary"
											min="0"
										/>
									</div>
								</div>
							</div>

							{/* Submit Button */}
							<div className="divider divider-neutral"></div>
							<div className="flex justify-end gap-4">
								<button
									type="button"
									onClick={() =>
										navigate("/admin/manage-exercise")
									}
									className="btn btn-outline btn-neutral btn-md"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn btn-primary btn-md gap-2"
									disabled={isLoading}
								>
									{isLoading ? (
										<span className="loading loading-spinner text-base-content"></span>
									) : (
										<>
											<Save className="w-5 h-5" />
											{id
												? "Update Exercise"
												: "Create Exercise"}
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateEditExercise;
