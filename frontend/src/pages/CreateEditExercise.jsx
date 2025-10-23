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

	const [tempMuscle, setTempMuscle] = useState("");
	const [tempEquipment, setTempEquipment] = useState("");
	const [tempTag, setTempTag] = useState("");
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
						default_prescription: result.data.default_prescription || {
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
			<div className="flex justify-center items-center min-h-screen">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-base-200 p-4">
			<div className="container mx-auto max-w-4xl">
				<div className="mb-6">
					<button
						type="button"
						onClick={() => navigate("/admin/manage-exercise")}
						className="btn btn-ghost"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Exercises
					</button>
				</div>

				<div className="card bg-base-100 shadow-xl">
					<div className="card-body">
						<h1 className="card-title text-3xl mb-6">
							{id ? "Edit Exercise" : "Create New Exercise"}
						</h1>

						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Basic Information */}
							<div className="divider">
								<h2 className="text-xl font-semibold">Basic Information</h2>
							</div>
							<div className="space-y-4">
								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">Name *</span>
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										className="input input-bordered"
										required
									/>
								</div>

								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">Description</span>
									</label>
									<textarea
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										className="textarea textarea-bordered"
										rows="4"
										placeholder="Enter exercise description..."
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="form-control">
										<label className="label">
											<span className="label-text font-semibold">Type</span>
										</label>
										<select
											name="type"
											value={formData.type}
											onChange={handleInputChange}
											className="select select-bordered"
										>
											<option value="strength">Strength</option>
											<option value="cardio">Cardio</option>
											<option value="mobility">Mobility</option>
											<option value="skill">Skill</option>
											<option value="hybrid">Hybrid</option>
										</select>
									</div>

									<div className="form-control">
										<label className="label">
											<span className="label-text font-semibold">Modality</span>
										</label>
										<select
											name="modality"
											value={formData.modality}
											onChange={handleInputChange}
											className="select select-bordered"
										>
											<option value="reps">Reps</option>
											<option value="time">Time</option>
											<option value="distance">Distance</option>
											<option value="interval">Interval</option>
											<option value="rpm">RPM</option>
										</select>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="form-control">
										<label className="label">
											<span className="label-text font-semibold">Difficulty</span>
										</label>
										<input
											type="range"
											name="difficulty"
											min="1"
											max="5"
											value={formData.difficulty}
											onChange={handleInputChange}
											className="range range-primary"
										/>
										<div className="w-full flex justify-between text-xs px-2">
											<span>1</span>
											<span>2</span>
											<span>3</span>
											<span>4</span>
											<span>5</span>
										</div>
										<div className="text-center mt-2">
											<span className="badge badge-primary badge-lg">
												{formData.difficulty}
											</span>
										</div>
									</div>

									<div className="form-control">
										<label className="label">
											<span className="label-text font-semibold">Estimated Minutes</span>
										</label>
										<input
											type="number"
											name="estimated_minutes"
											value={formData.estimated_minutes}
											onChange={handleInputChange}
											className="input input-bordered"
											min="1"
										/>
									</div>
								</div>

								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">Video URL</span>
									</label>
									<input
										type="url"
										name="video_url"
										value={formData.video_url}
										onChange={handleInputChange}
										className="input input-bordered"
										placeholder="https://..."
									/>
								</div>

								<div className="form-control">
									<label className="label cursor-pointer">
										<span className="label-text font-semibold">Published</span>
										<input
											type="checkbox"
											name="published"
											checked={formData.published}
											onChange={handleInputChange}
											className="toggle toggle-primary"
										/>
									</label>
								</div>
							</div>

							{/* Primary Muscles */}
							<div className="divider">
								<h2 className="text-xl font-semibold">Primary Muscles</h2>
							</div>
							<div className="space-y-4">
								<div className="flex gap-2">
									<input
										type="text"
										value={tempMuscle}
										onChange={(e) => setTempMuscle(e.target.value)}
										className="input input-bordered flex-1"
										placeholder="Add muscle (e.g., Chest, Biceps)"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddArrayItem("primary_muscles", tempMuscle);
												setTempMuscle("");
											}
										}}
									/>
									<button
										type="button"
										onClick={() => {
											handleAddArrayItem("primary_muscles", tempMuscle);
											setTempMuscle("");
										}}
										className="btn btn-primary"
									>
										Add
									</button>
								</div>
								<div className="flex flex-wrap gap-2">
									{formData.primary_muscles.map((muscle, index) => (
										<span key={index} className="badge badge-primary badge-lg p-3">
											{muscle}
											<button
												type="button"
												onClick={() => handleRemoveArrayItem("primary_muscles", index)}
												className="ml-2 hover:text-error"
											>
												×
											</button>
										</span>
									))}
								</div>
							</div>

							{/* Equipment */}
							<div className="divider">
								<h2 className="text-xl font-semibold">Equipment</h2>
							</div>
							<div className="space-y-4">
								<div className="flex gap-2">
									<input
										type="text"
										value={tempEquipment}
										onChange={(e) => setTempEquipment(e.target.value)}
										className="input input-bordered flex-1"
										placeholder="Add equipment (e.g., Dumbbell, Barbell)"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddArrayItem("equipment", tempEquipment);
												setTempEquipment("");
											}
										}}
									/>
									<button
										type="button"
										onClick={() => {
											handleAddArrayItem("equipment", tempEquipment);
											setTempEquipment("");
										}}
										className="btn btn-secondary"
									>
										Add
									</button>
								</div>
								<div className="flex flex-wrap gap-2">
									{formData.equipment.map((eq, index) => (
										<span key={index} className="badge badge-secondary badge-lg p-3">
											{eq}
											<button
												type="button"
												onClick={() => handleRemoveArrayItem("equipment", index)}
												className="ml-2 hover:text-error"
											>
												×
											</button>
										</span>
									))}
								</div>
							</div>

							{/* Tags */}
							<div className="divider">
								<h2 className="text-xl font-semibold">Tags</h2>
							</div>
							<div className="space-y-4">
								<div className="flex gap-2">
									<input
										type="text"
										value={tempTag}
										onChange={(e) => setTempTag(e.target.value)}
										className="input input-bordered flex-1"
										placeholder="Add tag (e.g., upper-body, beginner)"
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddArrayItem("tags", tempTag);
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
										className="btn btn-accent"
									>
										Add
									</button>
								</div>
								<div className="flex flex-wrap gap-2">
									{formData.tags.map((tag, index) => (
										<span key={index} className="badge badge-accent badge-lg p-3">
											{tag}
											<button
												type="button"
												onClick={() => handleRemoveArrayItem("tags", index)}
												className="ml-2 hover:text-error"
											>
												×
											</button>
										</span>
									))}
								</div>
							</div>

							{/* Default Prescription */}
							<div className="divider">
								<h2 className="text-xl font-semibold">Default Prescription</h2>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">Sets</span>
									</label>
									<input
										type="number"
										value={formData.default_prescription.sets}
										onChange={(e) =>
											handlePrescriptionChange("sets", parseInt(e.target.value))
										}
										className="input input-bordered"
										min="1"
									/>
								</div>
								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">Reps</span>
									</label>
									<input
										type="number"
										value={formData.default_prescription.reps}
										onChange={(e) =>
											handlePrescriptionChange("reps", parseInt(e.target.value))
										}
										className="input input-bordered"
										min="1"
									/>
								</div>
								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">Rest (seconds)</span>
									</label>
									<input
										type="number"
										value={formData.default_prescription.rest_seconds}
										onChange={(e) =>
											handlePrescriptionChange(
												"rest_seconds",
												parseInt(e.target.value)
											)
										}
										className="input input-bordered"
										min="0"
									/>
								</div>
							</div>

							{/* Submit Button */}
							<div className="divider"></div>
							<div className="flex justify-end gap-4 pt-4">
								<button
									type="button"
									onClick={() => navigate("/admin/manage-exercise")}
									className="btn btn-ghost"
								>
									Cancel
								</button>
								<button type="submit" className="btn btn-primary" disabled={isLoading}>
									{isLoading ? (
										<span className="loading loading-spinner"></span>
									) : (
										<>
											<Save className="w-4 h-4 mr-2" />
											{id ? "Update Exercise" : "Create Exercise"}
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
