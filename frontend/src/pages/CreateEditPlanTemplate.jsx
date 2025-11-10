import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Plus,
	Trash,
	Save,
	ChevronDown,
	ChevronUp,
	Search,
} from "lucide-react";
import { usePlanTemplateStore } from "../store/planTemplate/planTemplateStore";
import { useExerciseStore } from "../store/exercise/exerciseStore";
import toast from "react-hot-toast";

const CreateEditPlanTemplate = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEdit = !!id;

	const {
		currentTemplate,
		isLoading,
		getPlanTemplateById,
		createPlanTemplate,
		updatePlanTemplate,
		clearCurrentTemplate,
	} = usePlanTemplateStore();
	const { exercises, getExercises } = useExerciseStore();

	const [formData, setFormData] = useState({
		title: "",
		goal: "",
		level: "beginner",
		weeks: 4,
		daysPerWeek: 3,
		preferredDays: [],
		dayTemplates: [],
		published: false,
	});

	const [expandedDays, setExpandedDays] = useState({});
	const [showExerciseModal, setShowExerciseModal] = useState(false);
	const [currentDayIndex, setCurrentDayIndex] = useState(null);
	const [exerciseSearch, setExerciseSearch] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (isEdit && id) {
			loadTemplate();
		}
		loadExercises();

		return () => {
			clearCurrentTemplate();
		};
	}, [id, isEdit]);

	const loadTemplate = async () => {
		const result = await getPlanTemplateById(id);
		if (result.success && result.data) {
			setFormData({
				title: result.data.title || "",
				goal: result.data.goal || "",
				level: result.data.level || "beginner",
				weeks: result.data.weeks || 4,
				daysPerWeek: result.data.daysPerWeek || 3,
				preferredDays: result.data.preferredDays || [],
				dayTemplates: result.data.dayTemplates || [],
				published: result.data.published || false,
			});
		} else {
			toast.error(result.message || "Failed to load template");
		}
	};

	const loadExercises = async () => {
		await getExercises({ page: 1, limit: 100 });
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const addDay = () => {
		setFormData((prev) => ({
			...prev,
			dayTemplates: [
				...prev.dayTemplates,
				{
					name: `Day ${prev.dayTemplates.length + 1}`,
					exercises: [],
				},
			],
		}));
	};

	const removeDay = (dayIndex) => {
		setFormData((prev) => ({
			...prev,
			dayTemplates: prev.dayTemplates.filter(
				(_, idx) => idx !== dayIndex
			),
		}));
		setExpandedDays((prev) => {
			const newExpanded = { ...prev };
			delete newExpanded[dayIndex];
			return newExpanded;
		});
	};

	const updateDayName = (dayIndex, name) => {
		setFormData((prev) => ({
			...prev,
			dayTemplates: prev.dayTemplates.map((day, idx) =>
				idx === dayIndex ? { ...day, name } : day
			),
		}));
	};

	const toggleDay = (index) => {
		setExpandedDays((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const openExerciseModal = (dayIndex) => {
		setCurrentDayIndex(dayIndex);
		setShowExerciseModal(true);
	};

	const addExerciseToDay = (exercise) => {
		if (currentDayIndex === null) return;

		setFormData((prev) => ({
			...prev,
			dayTemplates: prev.dayTemplates.map((day, idx) => {
				if (idx === currentDayIndex) {
					return {
						...day,
						exercises: [
							...day.exercises,
							{
								exerciseId: exercise._id,
								planned: {
									sets: null,
									reps: null,
									load_kg: null,
									time_seconds: null,
									rest_seconds: null,
								},
								variant: "base",
								cue: "",
							},
						],
					};
				}
				return day;
			}),
		}));

		setShowExerciseModal(false);
		setExerciseSearch("");
		toast.success("Exercise added");
	};

	const removeExercise = (dayIndex, exerciseIndex) => {
		setFormData((prev) => ({
			...prev,
			dayTemplates: prev.dayTemplates.map((day, idx) => {
				if (idx === dayIndex) {
					return {
						...day,
						exercises: day.exercises.filter(
							(_, exIdx) => exIdx !== exerciseIndex
						),
					};
				}
				return day;
			}),
		}));
	};

	const updateExercisePrescription = (
		dayIndex,
		exerciseIndex,
		field,
		value
	) => {
		setFormData((prev) => ({
			...prev,
			dayTemplates: prev.dayTemplates.map((day, idx) => {
				if (idx === dayIndex) {
					return {
						...day,
						exercises: day.exercises.map((ex, exIdx) => {
							if (exIdx === exerciseIndex) {
								return {
									...ex,
									planned: {
										...ex.planned,
										[field]:
											value === "" ? null : Number(value),
									},
								};
							}
							return ex;
						}),
					};
				}
				return day;
			}),
		}));
	};

	const updateExerciseField = (dayIndex, exerciseIndex, field, value) => {
		setFormData((prev) => ({
			...prev,
			dayTemplates: prev.dayTemplates.map((day, idx) => {
				if (idx === dayIndex) {
					return {
						...day,
						exercises: day.exercises.map((ex, exIdx) => {
							if (exIdx === exerciseIndex) {
								return { ...ex, [field]: value };
							}
							return ex;
						}),
					};
				}
				return day;
			}),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.title.trim()) {
			toast.error("Title is required");
			return;
		}

		setIsSaving(true);

		const result = isEdit
			? await updatePlanTemplate(id, formData)
			: await createPlanTemplate(formData);

		setIsSaving(false);

		if (result.success) {
			toast.success(isEdit ? "Template updated!" : "Template created!");
			navigate("/admin/plan-templates");
		} else {
			toast.error(result.message || "Failed to save template");
		}
	};

	const filteredExercises = exercises.filter((ex) =>
		ex.name?.toLowerCase().includes(exerciseSearch.toLowerCase())
	);

	const getExerciseName = (exerciseId) => {
		const exercise = exercises.find((ex) => ex._id === exerciseId);
		return exercise?.name || "Unknown Exercise";
	};

	if (isLoading && isEdit) {
		return (
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-center items-center min-h-[400px]">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<Link
				to="/admin/plan-templates"
				className="btn btn-ghost btn-sm mb-6 gap-2"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Manage Templates
			</Link>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Header */}
				<div className="card bg-base-100 shadow-lg">
					<div className="card-body">
						<h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
							<span>📋</span>
							{isEdit
								? "Edit Plan Template"
								: "Create Plan Template"}
						</h1>
						<p className="text-base-content/70 mb-6">
							{isEdit
								? "Update the details of your workout plan template"
								: "Design a new workout plan template with exercises and progressions"}
						</p>

						<div className="space-y-4">
							{/* Title */}
							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">
										Title *
									</span>
								</label>
								<input
									type="text"
									name="title"
									value={formData.title}
									onChange={handleInputChange}
									className="input input-bordered w-full"
									placeholder="e.g., Beginner Strength Program"
									required
								/>
							</div>

							{/* Grid for Goal and Level */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">
											Goal
										</span>
									</label>
									<select
										name="goal"
										value={formData.goal}
										onChange={handleInputChange}
										className="select select-bordered w-full"
									>
										<option value="">Select Goal</option>
										<option value="strength">
											Strength
										</option>
										<option value="hypertrophy">
											Hypertrophy
										</option>
										<option value="fat_loss">
											Fat Loss
										</option>
										<option value="endurance">
											Endurance
										</option>
									</select>
								</div>

								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">
											Level
										</span>
									</label>
									<select
										name="level"
										value={formData.level}
										onChange={handleInputChange}
										className="select select-bordered w-full"
									>
										<option value="beginner">
											Beginner
										</option>
										<option value="intermediate">
											Intermediate
										</option>
										<option value="advanced">
											Advanced
										</option>
									</select>
								</div>
							</div>

							{/* Grid for Weeks and Days */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">
											Program Duration (Weeks)
										</span>
									</label>
									<input
										type="number"
										name="weeks"
										value={formData.weeks}
										onChange={handleInputChange}
										className="input input-bordered w-full"
										min="1"
										max="52"
									/>
								</div>

								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">
											Days Per Week
										</span>
									</label>
									<input
										type="number"
										name="daysPerWeek"
										value={formData.daysPerWeek}
										onChange={handleInputChange}
										className="input input-bordered w-full"
										min="1"
										max="7"
									/>
								</div>
							</div>

							{/* Preferred Days Selection */}
							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">
										Preferred Workout Days (Optional)
									</span>
								</label>
								<p className="text-sm text-base-content/70 mb-3">
									Select which days of the week this plan should be scheduled for
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
												formData.preferredDays?.includes(day.value)
													? "btn-primary"
													: "btn-outline"
											}`}
										>
											<input
												type="checkbox"
												className="hidden"
												checked={formData.preferredDays?.includes(day.value)}
												onChange={() => {
													const currentDays = formData.preferredDays || [];
													const newDays = currentDays.includes(day.value)
														? currentDays.filter((d) => d !== day.value)
														: [...currentDays, day.value];
													setFormData({ ...formData, preferredDays: newDays });
												}}
											/>
											{day.label}
										</label>
									))}
								</div>
								{formData.preferredDays?.length > 0 && (
									<p className="text-sm text-center mt-2 text-base-content/70">
										{formData.preferredDays.length} days selected
									</p>
								)}
							</div>

							{/* Published Toggle */}
							<div className="form-control">
								<label className="label cursor-pointer justify-start gap-4">
									<input
										type="checkbox"
										name="published"
										checked={formData.published}
										onChange={handleInputChange}
										className="checkbox checkbox-primary"
									/>
									<div>
										<span className="label-text font-semibold">
											Publish Template
										</span>
										<p className="text-sm text-base-content/60">
											Make this template visible to users
										</p>
									</div>
								</label>
							</div>
						</div>
					</div>
				</div>

				{/* Day Templates */}
				<div className="card bg-base-100 shadow-lg">
					<div className="card-body">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h2 className="text-2xl font-bold flex items-center gap-2">
									<span>🏋️</span> Workout Days
								</h2>
								<p className="text-sm text-base-content/70 mt-1">
									Define the workout days and exercises for
									this plan
								</p>
							</div>
							<button
								type="button"
								onClick={addDay}
								className="btn btn-primary btn-sm gap-2"
							>
								<Plus className="w-4 h-4" />
								Add Day
							</button>
						</div>

						{formData.dayTemplates.length === 0 ? (
							<div className="text-center py-8 text-base-content/70">
								<p>
									No workout days yet. Click "Add Day" to
									create one.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{formData.dayTemplates.map((day, dayIndex) => (
									<div
										key={dayIndex}
										className="border border-base-300 rounded-lg p-4"
									>
										<div className="flex items-center justify-between mb-3">
											<input
												type="text"
												value={day.name}
												onChange={(e) =>
													updateDayName(
														dayIndex,
														e.target.value
													)
												}
												className="input input-bordered input-sm flex-1 max-w-xs"
												placeholder="Day name"
											/>
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() =>
														toggleDay(dayIndex)
													}
													className="btn btn-ghost btn-sm"
												>
													{expandedDays[dayIndex] ? (
														<ChevronUp className="w-4 h-4" />
													) : (
														<ChevronDown className="w-4 h-4" />
													)}
												</button>
												<button
													type="button"
													onClick={() =>
														removeDay(dayIndex)
													}
													className="btn btn-ghost btn-sm text-error"
												>
													<Trash className="w-4 h-4" />
												</button>
											</div>
										</div>

										{expandedDays[dayIndex] && (
											<div className="mt-4">
												<div className="flex items-center justify-between mb-3">
													<h4 className="font-semibold">
														Exercises (
														{day.exercises.length})
													</h4>
													<button
														type="button"
														onClick={() =>
															openExerciseModal(
																dayIndex
															)
														}
														className="btn btn-sm btn-outline gap-2"
													>
														<Plus className="w-4 h-4" />
														Add Exercise
													</button>
												</div>

												{day.exercises.length === 0 ? (
													<p className="text-center text-base-content/60 py-4">
														No exercises added yet.
													</p>
												) : (
													<div className="space-y-3">
														{day.exercises.map(
															(
																exercise,
																exIndex
															) => (
																<div
																	key={
																		exIndex
																	}
																	className="bg-base-200 rounded-lg p-4"
																>
																	<div className="flex items-start justify-between mb-3">
																		<div className="flex-1">
																			<h5 className="font-semibold">
																				{getExerciseName(
																					exercise.exerciseId
																				)}
																			</h5>
																			<select
																				value={
																					exercise.variant
																				}
																				onChange={(
																					e
																				) =>
																					updateExerciseField(
																						dayIndex,
																						exIndex,
																						"variant",
																						e
																							.target
																							.value
																					)
																				}
																				className="select select-bordered select-xs mt-2"
																			>
																				<option value="base">
																					Base
																				</option>
																				<option value="advanced">
																					Advanced
																				</option>
																				<option value="easier">
																					Easier
																				</option>
																			</select>
																		</div>
																		<button
																			type="button"
																			onClick={() =>
																				removeExercise(
																					dayIndex,
																					exIndex
																				)
																			}
																			className="btn btn-ghost btn-sm text-error"
																		>
																			<Trash className="w-4 h-4" />
																		</button>
																	</div>

																	<div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
																		<div className="form-control">
																			<label className="label py-1">
																				<span className="label-text-alt font-semibold">
																					Sets
																				</span>
																			</label>
																			<input
																				type="number"
																				value={
																					exercise
																						.planned
																						.sets ||
																					""
																				}
																				onChange={(
																					e
																				) =>
																					updateExercisePrescription(
																						dayIndex,
																						exIndex,
																						"sets",
																						e
																							.target
																							.value
																					)
																				}
																				className="input input-bordered input-sm"
																				placeholder="0"
																			/>
																		</div>
																		<div className="form-control">
																			<label className="label py-1">
																				<span className="label-text-alt font-semibold">
																					Reps
																				</span>
																			</label>
																			<input
																				type="number"
																				value={
																					exercise
																						.planned
																						.reps ||
																					""
																				}
																				onChange={(
																					e
																				) =>
																					updateExercisePrescription(
																						dayIndex,
																						exIndex,
																						"reps",
																						e
																							.target
																							.value
																					)
																				}
																				className="input input-bordered input-sm"
																				placeholder="0"
																			/>
																		</div>
																		<div className="form-control">
																			<label className="label py-1">
																				<span className="label-text-alt font-semibold">
																					Load
																					(kg)
																				</span>
																			</label>
																			<input
																				type="number"
																				value={
																					exercise
																						.planned
																						.load_kg ||
																					""
																				}
																				onChange={(
																					e
																				) =>
																					updateExercisePrescription(
																						dayIndex,
																						exIndex,
																						"load_kg",
																						e
																							.target
																							.value
																					)
																				}
																				className="input input-bordered input-sm"
																				placeholder="0"
																			/>
																		</div>
																		<div className="form-control">
																			<label className="label py-1">
																				<span className="label-text-alt font-semibold">
																					Time
																					(s)
																				</span>
																			</label>
																			<input
																				type="number"
																				value={
																					exercise
																						.planned
																						.time_seconds ||
																					""
																				}
																				onChange={(
																					e
																				) =>
																					updateExercisePrescription(
																						dayIndex,
																						exIndex,
																						"time_seconds",
																						e
																							.target
																							.value
																					)
																				}
																				className="input input-bordered input-sm"
																				placeholder="0"
																			/>
																		</div>
																		<div className="form-control">
																			<label className="label py-1">
																				<span className="label-text-alt font-semibold">
																					Rest
																					(s)
																				</span>
																			</label>
																			<input
																				type="number"
																				value={
																					exercise
																						.planned
																						.rest_seconds ||
																					""
																				}
																				onChange={(
																					e
																				) =>
																					updateExercisePrescription(
																						dayIndex,
																						exIndex,
																						"rest_seconds",
																						e
																							.target
																							.value
																					)
																				}
																				className="input input-bordered input-sm"
																				placeholder="0"
																			/>
																		</div>
																	</div>

																	<div className="form-control">
																		<label className="label py-1">
																			<span className="label-text-alt font-semibold">
																				Coaching
																				Cue
																			</span>
																		</label>
																		<textarea
																			value={
																				exercise.cue
																			}
																			onChange={(
																				e
																			) =>
																				updateExerciseField(
																					dayIndex,
																					exIndex,
																					"cue",
																					e
																						.target
																						.value
																				)
																			}
																			className="textarea textarea-bordered textarea-sm"
																			placeholder="Optional coaching cue or modification note..."
																			rows="2"
																		/>
																	</div>
																</div>
															)
														)}
													</div>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end gap-3">
					<Link to="/admin/plan-templates" className="btn btn-ghost">
						Cancel
					</Link>
					<button
						type="submit"
						className="btn btn-primary gap-2"
						disabled={isSaving}
					>
						{isSaving ? (
							<>
								<span className="loading loading-spinner loading-sm"></span>
								Saving...
							</>
						) : (
							<>
								<Save className="w-4 h-4" />
								{isEdit ? "Update Template" : "Create Template"}
							</>
						)}
					</button>
				</div>
			</form>

			{/* Exercise Selection Modal */}
			{showExerciseModal && (
				<div className="modal modal-open">
					<div className="modal-box max-w-2xl">
						<h3 className="font-bold text-lg mb-4">Add Exercise</h3>

						<div className="form-control mb-4">
							<div className="relative">
								<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
								<input
									type="text"
									placeholder="Search exercises..."
									className="input input-bordered w-full pl-10"
									value={exerciseSearch}
									onChange={(e) =>
										setExerciseSearch(e.target.value)
									}
									autoFocus
								/>
							</div>
						</div>

						<div className="max-h-96 overflow-y-auto space-y-2">
							{filteredExercises.length === 0 ? (
								<p className="text-center text-base-content/70 py-8">
									No exercises found.
								</p>
							) : (
								filteredExercises.map((exercise) => (
									<div
										key={exercise._id}
										onClick={() =>
											addExerciseToDay(exercise)
										}
										className="p-3 bg-base-200 hover:bg-base-300 rounded-lg cursor-pointer transition-colors"
									>
										<h4 className="font-semibold">
											{exercise.name}
										</h4>
										{exercise.primary_muscles &&
											exercise.primary_muscles.length >
												0 && (
												<p className="text-sm text-base-content/70">
													{exercise.primary_muscles.join(
														", "
													)}
												</p>
											)}
									</div>
								))
							)}
						</div>

						<div className="modal-action">
							<button
								type="button"
								className="btn"
								onClick={() => {
									setShowExerciseModal(false);
									setExerciseSearch("");
								}}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CreateEditPlanTemplate;
