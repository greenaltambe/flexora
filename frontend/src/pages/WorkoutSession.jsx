import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDailySessionStore } from "../store/dailySession/dailySessionStore";
import { useSessionLogStore } from "../store/sessionLog/sessionLogStore";
import toast from "react-hot-toast";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Play,
	Pause,
	X,
	Timer,
	Dumbbell,
	CheckCircle,
} from "lucide-react";

const WorkoutSession = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { todaySession } = useDailySessionStore();
	const { submitSessionLog, isLoading } = useSessionLogStore();

	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [exerciseLogs, setExerciseLogs] = useState([]);
	const [timerActive, setTimerActive] = useState(false);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [showExitModal, setShowExitModal] = useState(false);

	useEffect(() => {
		if (
			!todaySession ||
			!todaySession.exercises ||
			todaySession.exercises.length === 0
		) {
			toast.error("No workout session found");
			navigate("/dashboard");
			return;
		}

		// Initialize exercise logs
		const initialLogs = todaySession.exercises.map((exercise) => {
			const exerciseData = exercise.exercise || exercise;
			const isTimeBased =
				exerciseData.type === "cardio" || exercise.duration;

			if (isTimeBased) {
				return {
					exerciseId: exerciseData._id || exerciseData.id,
					name: exerciseData.name,
					type: "timed",
					duration: exercise.duration || 0,
					completed: false,
					actualDuration: 0,
				};
			} else {
				const sets = exercise.sets || 3;
				return {
					exerciseId: exerciseData._id || exerciseData.id,
					name: exerciseData.name,
					type: "sets",
					plannedSets: sets,
					plannedReps: exercise.reps || 10,
					plannedLoad: exercise.load || 0,
					sets: Array.from({ length: sets }, () => ({
						reps: exercise.reps || 10,
						load: exercise.load || 0,
						completed: false,
					})),
					completed: false,
				};
			}
		});

		setExerciseLogs(initialLogs);
	}, [todaySession, navigate]);

	// Timer effect for time-based exercises
	useEffect(() => {
		let interval;
		if (timerActive) {
			interval = setInterval(() => {
				setTimeElapsed((prev) => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [timerActive]);

	const currentExercise = todaySession?.exercises?.[currentExerciseIndex];
	const currentLog = exerciseLogs[currentExerciseIndex];
	const exerciseData = currentExercise?.exercise || currentExercise;

	const handleSetComplete = (setIndex) => {
		setExerciseLogs((prev) => {
			const newLogs = [...prev];
			newLogs[currentExerciseIndex].sets[setIndex].completed =
				!newLogs[currentExerciseIndex].sets[setIndex].completed;
			return newLogs;
		});
	};

	const handleSetChange = (setIndex, field, value) => {
		setExerciseLogs((prev) => {
			const newLogs = [...prev];
			newLogs[currentExerciseIndex].sets[setIndex][field] = value;
			return newLogs;
		});
	};

	const handleTimerStart = () => {
		setTimerActive(true);
	};

	const handleTimerPause = () => {
		setTimerActive(false);
	};

	const handleTimerComplete = () => {
		setTimerActive(false);
		setExerciseLogs((prev) => {
			const newLogs = [...prev];
			newLogs[currentExerciseIndex].actualDuration = timeElapsed;
			newLogs[currentExerciseIndex].completed = true;
			return newLogs;
		});
		toast.success("Exercise completed!");
	};

	const handleNextExercise = () => {
		if (currentLog?.type === "sets") {
			const allSetsCompleted = currentLog.sets.every(
				(set) => set.completed
			);
			if (!allSetsCompleted) {
				toast.error("Please complete all sets before moving on");
				return;
			}
			setExerciseLogs((prev) => {
				const newLogs = [...prev];
				newLogs[currentExerciseIndex].completed = true;
				return newLogs;
			});
		}

		if (currentExerciseIndex < todaySession.exercises.length - 1) {
			setCurrentExerciseIndex((prev) => prev + 1);
			setTimeElapsed(0);
			setTimerActive(false);
		}
	};

	const handlePreviousExercise = () => {
		if (currentExerciseIndex > 0) {
			setCurrentExerciseIndex((prev) => prev - 1);
			setTimeElapsed(0);
			setTimerActive(false);
		}
	};

	const handleSkipExercise = () => {
		if (currentExerciseIndex < todaySession.exercises.length - 1) {
			setCurrentExerciseIndex((prev) => prev + 1);
			setTimeElapsed(0);
			setTimerActive(false);
		}
	};

	const handleCompleteWorkout = async () => {
		// Check if all exercises are completed
		const allCompleted = exerciseLogs.every((log) => log.completed);

		if (!allCompleted) {
			const confirmed = window.confirm(
				"You haven't completed all exercises. Are you sure you want to finish?"
			);
			if (!confirmed) return;
		}

		// Format logs for backend
		const today = new Date().toISOString().split("T")[0];
		const formattedLogs = {
			date: today,
			sessionId: todaySession._id,
			exercises: exerciseLogs.map((log) => {
				if (log.type === "timed") {
					return {
						exerciseId: log.exerciseId,
						duration: log.actualDuration || log.duration,
						completed: log.completed,
					};
				} else {
					return {
						exerciseId: log.exerciseId,
						sets: log.sets.map((set) => ({
							reps: parseInt(set.reps) || 0,
							load: parseFloat(set.load) || 0,
							completed: set.completed,
						})),
						completed: log.completed,
					};
				}
			}),
		};

		const result = await submitSessionLog(today, formattedLogs);

		if (result.success) {
			toast.success("Workout completed! Great job! 💪");
			navigate("/dashboard");
		} else {
			toast.error(result.message || "Failed to save workout");
		}
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const progressPercentage =
		((currentExerciseIndex + 1) / todaySession?.exercises?.length) * 100;
	const completedExercises = exerciseLogs.filter(
		(log) => log.completed
	).length;

	if (!todaySession || !currentExercise || !currentLog) {
		return (
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-center items-center min-h-[400px]">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<button
					onClick={() => setShowExitModal(true)}
					className="btn btn-ghost btn-sm gap-2"
				>
					<X className="w-4 h-4" />
					Exit Workout
				</button>
				<div className="text-sm text-base-content/70">
					{completedExercises} / {todaySession.exercises.length}{" "}
					completed
				</div>
			</div>

			{/* Progress Bar */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium">
						Workout Progress
					</span>
					<span className="text-sm text-base-content/70">
						Exercise {currentExerciseIndex + 1} of{" "}
						{todaySession.exercises.length}
					</span>
				</div>
				<progress
					className="progress progress-primary w-full"
					value={progressPercentage}
					max="100"
				></progress>
			</div>

			{/* Exercise Card */}
			<div className="card bg-base-100 shadow-lg mb-6">
				<div className="card-body">
					<div className="flex items-start justify-between mb-4">
						<div>
							<h2 className="text-2xl font-bold mb-2">
								{exerciseData?.name || "Exercise"}
							</h2>
							<div className="flex gap-2 flex-wrap">
								{exerciseData?.primaryMuscle && (
									<span className="badge badge-primary">
										{exerciseData.primaryMuscle}
									</span>
								)}
								{exerciseData?.type && (
									<span
										className={`badge ${
											exerciseData.type === "cardio"
												? "badge-error"
												: exerciseData.type ===
												  "strength"
												? "badge-success"
												: "badge-warning"
										}`}
									>
										{exerciseData.type}
									</span>
								)}
								{exerciseData?.equipment &&
									exerciseData.equipment !== "none" && (
										<span className="badge badge-ghost">
											{exerciseData.equipment}
										</span>
									)}
							</div>
						</div>
						{currentLog?.completed && (
							<div className="badge badge-success gap-1">
								<CheckCircle className="w-3 h-3" />
								Completed
							</div>
						)}
					</div>

					{/* Set-Based Exercise */}
					{currentLog?.type === "sets" && (
						<div className="space-y-4">
							<div className="bg-base-200 p-4 rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<Dumbbell className="w-5 h-5" />
									<span className="font-semibold">
										Target:
									</span>
									<span>
										{currentLog.plannedSets} sets ×{" "}
										{currentLog.plannedReps} reps
										{currentLog.plannedLoad > 0 &&
											` @ ${currentLog.plannedLoad}kg`}
									</span>
								</div>
							</div>

							<div className="space-y-3">
								{currentLog.sets.map((set, index) => (
									<div
										key={index}
										className={`p-4 rounded-lg border-2 transition-colors ${
											set.completed
												? "bg-success/10 border-success"
												: "bg-base-200 border-base-300"
										}`}
									>
										<div className="flex items-center gap-4">
											<div className="shrink-0">
												<span className="font-bold text-lg">
													Set {index + 1}
												</span>
											</div>

											<div className="flex gap-4 flex-1 flex-wrap">
												<div className="form-control">
													<label className="label py-1">
														<span className="label-text text-xs">
															Reps
														</span>
													</label>
													<input
														type="number"
														value={set.reps}
														onChange={(e) =>
															handleSetChange(
																index,
																"reps",
																parseInt(
																	e.target
																		.value
																) || 0
															)
														}
														className="input input-bordered input-sm w-20"
														disabled={set.completed}
													/>
												</div>

												<div className="form-control">
													<label className="label py-1">
														<span className="label-text text-xs">
															Weight (kg)
														</span>
													</label>
													<input
														type="number"
														step="0.5"
														value={set.load}
														onChange={(e) =>
															handleSetChange(
																index,
																"load",
																parseFloat(
																	e.target
																		.value
																) || 0
															)
														}
														className="input input-bordered input-sm w-24"
														disabled={set.completed}
													/>
												</div>
											</div>

											<button
												onClick={() =>
													handleSetComplete(index)
												}
												className={`btn btn-sm ${
													set.completed
														? "btn-success"
														: "btn-outline"
												}`}
											>
												{set.completed ? (
													<>
														<Check className="w-4 h-4" />
														Done
													</>
												) : (
													"Complete"
												)}
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Time-Based Exercise */}
					{currentLog?.type === "timed" && (
						<div className="space-y-6">
							<div className="bg-base-200 p-4 rounded-lg text-center">
								<div className="flex items-center justify-center gap-2 mb-2">
									<Timer className="w-5 h-5" />
									<span className="font-semibold">
										Target Duration:
									</span>
									<span className="text-lg">
										{formatTime(currentLog.duration)}
									</span>
								</div>
							</div>

							<div className="text-center">
								<div className="text-6xl font-bold mb-6 font-mono">
									{formatTime(timeElapsed)}
								</div>

								<div className="flex gap-4 justify-center">
									{!timerActive ? (
										<button
											onClick={handleTimerStart}
											className="btn btn-primary btn-lg gap-2"
											disabled={currentLog.completed}
										>
											<Play className="w-5 h-5" />
											Start Timer
										</button>
									) : (
										<button
											onClick={handleTimerPause}
											className="btn btn-warning btn-lg gap-2"
										>
											<Pause className="w-5 h-5" />
											Pause
										</button>
									)}

									<button
										onClick={handleTimerComplete}
										className="btn btn-success btn-lg gap-2"
										disabled={
											!timerActive && timeElapsed === 0
										}
									>
										<Check className="w-5 h-5" />
										Complete
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Navigation Buttons */}
			<div className="flex gap-4 justify-between">
				<button
					onClick={handlePreviousExercise}
					className="btn btn-outline gap-2"
					disabled={currentExerciseIndex === 0}
				>
					<ArrowLeft className="w-4 h-4" />
					Previous
				</button>

				<button
					onClick={handleSkipExercise}
					className="btn btn-ghost gap-2"
					disabled={
						currentExerciseIndex ===
						todaySession.exercises.length - 1
					}
				>
					Skip Exercise
				</button>

				{currentExerciseIndex < todaySession.exercises.length - 1 ? (
					<button
						onClick={handleNextExercise}
						className="btn btn-primary gap-2"
					>
						Next
						<ArrowRight className="w-4 h-4" />
					</button>
				) : (
					<button
						onClick={handleCompleteWorkout}
						className="btn btn-success gap-2"
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="loading loading-spinner loading-sm"></span>
						) : (
							<Check className="w-4 h-4" />
						)}
						Finish Workout
					</button>
				)}
			</div>

			{/* Exit Confirmation Modal */}
			{showExitModal && (
				<dialog className="modal modal-open">
					<div className="modal-box">
						<h3 className="font-bold text-lg mb-4">
							Exit Workout?
						</h3>
						<p className="mb-6">
							Your progress will not be saved. Are you sure you
							want to exit?
						</p>
						<div className="modal-action">
							<button
								className="btn btn-ghost"
								onClick={() => setShowExitModal(false)}
							>
								Cancel
							</button>
							<button
								className="btn btn-error"
								onClick={() => navigate("/dashboard")}
							>
								Exit Without Saving
							</button>
						</div>
					</div>
					<div
						className="modal-backdrop"
						onClick={() => setShowExitModal(false)}
					></div>
				</dialog>
			)}
		</div>
	);
};

export default WorkoutSession;
