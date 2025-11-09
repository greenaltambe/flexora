import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePlanTemplateStore } from "../store/planTemplate/planTemplateStore";
import { useExerciseStore } from "../store/exercise/exerciseStore";
import { 
	ArrowLeft, 
	Calendar, 
	Dumbbell, 
	Target, 
	TrendingUp,
	CheckCircle,
	ChevronDown,
	ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";

const PlanTemplateDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { currentTemplate, isLoading, getPlanTemplateById } = usePlanTemplateStore();
	const { getExerciseById } = useExerciseStore();
	const [expandedDays, setExpandedDays] = useState({});
	const [exerciseDetails, setExerciseDetails] = useState({});

	useEffect(() => {
		if (id) {
			loadTemplate();
		}
	}, [id]);

	const loadTemplate = async () => {
		const result = await getPlanTemplateById(id);
		if (!result.success) {
			toast.error(result.message || "Failed to load template");
		}
	};

	useEffect(() => {
		if (currentTemplate?.dayTemplates) {
			loadExerciseDetails();
		}
	}, [currentTemplate]);

	const loadExerciseDetails = async () => {
		const exerciseIds = new Set();
		currentTemplate.dayTemplates.forEach(day => {
			day.exercises?.forEach(ex => {
				if (ex.exerciseId) {
					exerciseIds.add(ex.exerciseId);
				}
			});
		});

		const details = {};
		for (const exId of exerciseIds) {
			const result = await getExerciseById(exId);
			if (result.success && result.data) {
				details[exId] = result.data;
			}
		}
		setExerciseDetails(details);
	};

	const toggleDay = (index) => {
		setExpandedDays(prev => ({
			...prev,
			[index]: !prev[index]
		}));
	};

	const getLevelColor = (level) => {
		const colors = {
			beginner: "badge-success",
			intermediate: "badge-warning",
			advanced: "badge-error",
		};
		return colors[level] || "badge-ghost";
	};

	if (isLoading || !currentTemplate) {
		return (
			<div className="max-w-5xl mx-auto">
				<div className="flex justify-center items-center min-h-[400px]">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto">
			<Link to="/plans" className="btn btn-ghost btn-sm mb-4 gap-2">
				<ArrowLeft className="w-4 h-4" />
				Back to Plans
			</Link>

			{/* Header Card */}
			<div className="card bg-base-100 shadow-lg mb-6">
				<div className="card-body">
					<div className="flex items-start justify-between">
						<div>
							<h1 className="text-3xl font-bold mb-3">{currentTemplate.title}</h1>
							<div className="flex flex-wrap gap-2 mb-4">
								<div className={`badge ${getLevelColor(currentTemplate.level)} capitalize`}>
									{currentTemplate.level}
								</div>
								{currentTemplate.goal && (
									<div className="badge badge-outline capitalize">
										{currentTemplate.goal.replace("_", " ")}
									</div>
								)}
							</div>
						</div>
						{currentTemplate.published && (
							<div className="badge badge-success gap-1">
								<CheckCircle className="w-3 h-3" />
								Published
							</div>
						)}
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
						<div className="stat bg-base-200 rounded-lg p-4">
							<div className="stat-title text-xs">Duration</div>
							<div className="stat-value text-2xl flex items-center gap-2">
								<Calendar className="w-5 h-5" />
								{currentTemplate.weeks}
							</div>
							<div className="stat-desc">weeks</div>
						</div>

						<div className="stat bg-base-200 rounded-lg p-4">
							<div className="stat-title text-xs">Frequency</div>
							<div className="stat-value text-2xl flex items-center gap-2">
								<Dumbbell className="w-5 h-5" />
								{currentTemplate.daysPerWeek}
							</div>
							<div className="stat-desc">days/week</div>
						</div>

						<div className="stat bg-base-200 rounded-lg p-4">
							<div className="stat-title text-xs">Total Days</div>
							<div className="stat-value text-2xl">
								{currentTemplate.dayTemplates?.length || 0}
							</div>
							<div className="stat-desc">day templates</div>
						</div>

						<div className="stat bg-base-200 rounded-lg p-4">
							<div className="stat-title text-xs">Total Exercises</div>
							<div className="stat-value text-2xl">
								{currentTemplate.dayTemplates?.reduce((sum, day) => 
									sum + (day.exercises?.length || 0), 0) || 0}
							</div>
							<div className="stat-desc">exercises</div>
						</div>
					</div>
				</div>
			</div>

			{/* Day Templates */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold mb-4">Workout Days</h2>
				
				{currentTemplate.dayTemplates?.length === 0 ? (
					<div className="card bg-base-100 shadow-lg p-8 text-center">
						<p className="text-base-content/70">No workout days configured yet.</p>
					</div>
				) : (
					currentTemplate.dayTemplates?.map((day, dayIndex) => (
						<div key={dayIndex} className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<div 
									className="flex items-center justify-between cursor-pointer"
									onClick={() => toggleDay(dayIndex)}
								>
									<div>
										<h3 className="text-xl font-bold">
											{day.name || `Day ${dayIndex + 1}`}
										</h3>
										<p className="text-sm text-base-content/70">
											{day.exercises?.length || 0} exercises
										</p>
									</div>
									{expandedDays[dayIndex] ? (
										<ChevronUp className="w-5 h-5" />
									) : (
										<ChevronDown className="w-5 h-5" />
									)}
								</div>

								{expandedDays[dayIndex] && (
									<div className="mt-4 space-y-3">
										{day.exercises?.length === 0 ? (
											<p className="text-base-content/60 text-center py-4">
												No exercises added yet.
											</p>
										) : (
											day.exercises?.map((exercise, exIndex) => {
												const exDetail = exerciseDetails[exercise.exerciseId];
												return (
													<div key={exIndex} className="bg-base-200 rounded-lg p-4">
														<div className="flex items-start justify-between mb-2">
															<div className="flex-1">
																<h4 className="font-semibold">
																	{exDetail?.name || "Loading..."}
																</h4>
																{exercise.variant !== "base" && (
																	<span className="badge badge-sm badge-outline mt-1 capitalize">
																		{exercise.variant}
																	</span>
																)}
															</div>
														</div>

														{exercise.planned && Object.keys(exercise.planned).length > 0 && (
															<div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm mt-3">
																{exercise.planned.sets && (
																	<div>
																		<span className="text-base-content/70">Sets:</span>
																		<span className="font-semibold ml-1">
																			{exercise.planned.sets}
																		</span>
																	</div>
																)}
																{exercise.planned.reps && (
																	<div>
																		<span className="text-base-content/70">Reps:</span>
																		<span className="font-semibold ml-1">
																			{exercise.planned.reps}
																		</span>
																	</div>
																)}
																{exercise.planned.load_kg && (
																	<div>
																		<span className="text-base-content/70">Load:</span>
																		<span className="font-semibold ml-1">
																			{exercise.planned.load_kg} kg
																		</span>
																	</div>
																)}
																{exercise.planned.time_seconds && (
																	<div>
																		<span className="text-base-content/70">Time:</span>
																		<span className="font-semibold ml-1">
																			{exercise.planned.time_seconds}s
																		</span>
																	</div>
																)}
																{exercise.planned.rest_seconds && (
																	<div>
																		<span className="text-base-content/70">Rest:</span>
																		<span className="font-semibold ml-1">
																			{exercise.planned.rest_seconds}s
																		</span>
																	</div>
																)}
															</div>
														)}

														{exercise.cue && (
															<div className="mt-2 text-sm">
																<span className="text-base-content/70">Cue: </span>
																<span className="italic">{exercise.cue}</span>
															</div>
														)}
													</div>
												);
											})
										)}
									</div>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default PlanTemplateDetail;
