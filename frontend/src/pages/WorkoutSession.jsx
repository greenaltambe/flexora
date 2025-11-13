import { useState, useEffect, useRef } from "react";
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
	Clock,
	Zap,
	Trophy,
} from "lucide-react";

const WorkoutSession = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { todaySession } = useDailySessionStore();
	const { submitSessionLog, isLoading } = useSessionLogStore();

	// Workout states
	const [workoutStarted, setWorkoutStarted] = useState(false);
	const [currentSetNumber, setCurrentSetNumber] = useState(1);
	const [currentExerciseInSet, setCurrentExerciseInSet] = useState(0);
	const [isResting, setIsResting] = useState(false);
	const [restTimeLeft, setRestTimeLeft] = useState(30);
	const [workoutComplete, setWorkoutComplete] = useState(false);
	const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
	
	// Exercise logs: tracks reps completed for each exercise in each set
	const [exerciseLogs, setExerciseLogs] = useState([]);
	const [showExitModal, setShowExitModal] = useState(false);
	
	const restTimerRef = useRef(null);
	const workoutTimerRef = useRef(null);

	// Initialize exercise logs structure
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

		// Get number of sets from the first exercise (assuming all have same sets)
		const totalSets = todaySession.exercises[0]?.sets || 3;
		
		// Initialize logs: for each set, for each exercise, store reps
		const initialLogs = [];
		for (let setNum = 1; setNum <= totalSets; setNum++) {
			const setLog = todaySession.exercises.map((exercise) => ({
				exerciseId: exercise.exerciseId?._id || exercise.exerciseId,
				exerciseName: exercise.exerciseId?.name || "Exercise",
				plannedReps: exercise.reps || 10,
				plannedLoad: exercise.load || 0,
				actualReps: exercise.reps || 10,
				actualLoad: exercise.load || 0,
				completed: false,
			}));
			initialLogs.push(setLog);
		}
		
		setExerciseLogs(initialLogs);
	}, [todaySession, navigate]);

	// Workout timer (total time)
	useEffect(() => {
		if (workoutStarted && !workoutComplete && !isResting) {
			workoutTimerRef.current = setInterval(() => {
				setTotalWorkoutTime((prev) => prev + 1);
			}, 1000);
		} else {
			if (workoutTimerRef.current) {
				clearInterval(workoutTimerRef.current);
			}
		}
		return () => {
			if (workoutTimerRef.current) {
				clearInterval(workoutTimerRef.current);
			}
		};
	}, [workoutStarted, workoutComplete, isResting]);

	// Rest timer countdown
	useEffect(() => {
		if (isResting && restTimeLeft > 0) {
			restTimerRef.current = setTimeout(() => {
				setRestTimeLeft((prev) => prev - 1);
			}, 1000);
		} else if (isResting && restTimeLeft === 0) {
			handleRestComplete();
		}
		return () => {
			if (restTimerRef.current) {
				clearTimeout(restTimerRef.current);
			}
		};
	}, [isResting, restTimeLeft]);

	const totalSets = exerciseLogs.length;
	const totalExercises = todaySession?.exercises?.length || 0;
	const currentExercise = todaySession?.exercises?.[currentExerciseInSet];
	const currentExerciseData = currentExercise?.exerciseId || currentExercise?.exercise || currentExercise;
	const currentLog = exerciseLogs[currentSetNumber - 1]?.[currentExerciseInSet];

	// Start the workout
	const handleStartWorkout = () => {
		setWorkoutStarted(true);
		toast.success("Workout started! Let's crush it! 💪");
	};

	// Handle reps input change
	const handleRepsChange = (value) => {
		const newLogs = [...exerciseLogs];
		newLogs[currentSetNumber - 1][currentExerciseInSet].actualReps = parseInt(value) || 0;
		setExerciseLogs(newLogs);
	};

	// Handle weight input change
	const handleLoadChange = (value) => {
		const newLogs = [...exerciseLogs];
		newLogs[currentSetNumber - 1][currentExerciseInSet].actualLoad = parseFloat(value) || 0;
		setExerciseLogs(newLogs);
	};

	// Complete current exercise and move to rest or next
	const handleExerciseComplete = () => {
		// Mark exercise as completed
		const newLogs = [...exerciseLogs];
		newLogs[currentSetNumber - 1][currentExerciseInSet].completed = true;
		setExerciseLogs(newLogs);

		toast.success(`${currentLog.exerciseName} completed!`);

		// Check if this was the last exercise in the set
		if (currentExerciseInSet < totalExercises - 1) {
			// Move to next exercise after 30s rest
			setIsResting(true);
			setRestTimeLeft(30);
		} else {
			// Last exercise in set - check if more sets remain
			if (currentSetNumber < totalSets) {
				// Start rest before next set (longer rest between sets)
				toast.success(`Set ${currentSetNumber} complete! Rest before next set.`);
				setIsResting(true);
				setRestTimeLeft(90); // 90 seconds between sets
			} else {
				// All sets complete - workout done!
				handleWorkoutComplete();
			}
		}
	};

	// Skip rest and continue
	const handleSkipRest = () => {
		if (restTimerRef.current) {
			clearTimeout(restTimerRef.current);
		}
		handleRestComplete();
	};

	// Handle rest completion
	const handleRestComplete = () => {
		setIsResting(false);
		
		// Move to next exercise or next set
		if (currentExerciseInSet < totalExercises - 1) {
			// Move to next exercise in same set
			setCurrentExerciseInSet((prev) => prev + 1);
		} else {
			// Move to next set, first exercise
			setCurrentSetNumber((prev) => prev + 1);
			setCurrentExerciseInSet(0);
			toast.success(`Starting Set ${currentSetNumber + 1}!`);
		}
		
		setRestTimeLeft(30);
	};

	// Complete the entire workout
	const handleWorkoutComplete = async () => {
		setWorkoutComplete(true);
		
		// Format logs for backend
		const today = new Date().toISOString().split("T")[0];
		
		// Transform our set-based logs into exercise-based logs
		const exerciseLogsForBackend = todaySession.exercises.map((exercise, exerciseIndex) => {
			const sets = exerciseLogs.map((setLog) => ({
				reps: setLog[exerciseIndex].actualReps,
				load: setLog[exerciseIndex].actualLoad,
				completed: setLog[exerciseIndex].completed,
			}));
			
			return {
				exerciseId: exercise.exerciseId?._id || exercise.exerciseId,
				sets: sets,
				completed: sets.every(s => s.completed),
			};
		});

		const formattedLogs = {
			date: today,
			sessionId: todaySession._id,
			exercises: exerciseLogsForBackend,
		};

		const result = await submitSessionLog(today, formattedLogs);

		if (result.success) {
			toast.success("Workout completed and logged! Amazing work! 🎉");
			// Don't navigate immediately, show completion screen
		} else {
			toast.error(result.message || "Failed to save workout");
		}
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const getCompletedExercisesCount = () => {
		return exerciseLogs.flat().filter(log => log.completed).length;
	};

	const getTotalExercisesCount = () => {
		return totalSets * totalExercises;
	};

	const getProgressPercentage = () => {
		const completed = getCompletedExercisesCount();
		const total = getTotalExercisesCount();
		return (completed / total) * 100;
	};

	if (!todaySession || !currentExercise) {
		return (
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-center items-center min-h-[400px]">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			</div>
		);
	}

	// Workout Complete Screen
	if (workoutComplete) {
		return (
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="text-center">
					<div className="card bg-linear-to-br from-success to-primary text-primary-content shadow-2xl">
						<div className="card-body items-center text-center py-12">
							<Trophy className="w-24 h-24 mb-4" />
							<h1 className="text-4xl font-bold mb-2">Workout Complete!</h1>
							<p className="text-xl opacity-90 mb-6">Amazing work! You crushed it! 💪</p>
							
							<div className="stats shadow stats-vertical lg:stats-horizontal">
								<div className="stat">
									<div className="stat-figure text-primary-content">
										<Clock className="w-8 h-8" />
									</div>
									<div className="stat-title text-primary-content/70">Total Time</div>
									<div className="stat-value text-primary-content">{formatTime(totalWorkoutTime)}</div>
								</div>
								
								<div className="stat">
									<div className="stat-figure text-primary-content">
										<Dumbbell className="w-8 h-8" />
									</div>
									<div className="stat-title text-primary-content/70">Total Sets</div>
									<div className="stat-value text-primary-content">{totalSets}</div>
								</div>
								
								<div className="stat">
									<div className="stat-figure text-primary-content">
										<Zap className="w-8 h-8" />
									</div>
									<div className="stat-title text-primary-content/70">Exercises</div>
									<div className="stat-value text-primary-content">{totalExercises}</div>
								</div>
							</div>

							<div className="flex gap-4 mt-8">
								<button
									onClick={() => navigate("/dashboard")}
									className="btn btn-lg btn-accent gap-2"
								>
									<Check className="w-5 h-5" />
									Back to Dashboard
								</button>
								<button
									onClick={() => navigate("/workout-history")}
									className="btn btn-lg btn-outline btn-accent gap-2"
								>
									View History
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Pre-Workout Start Screen
	if (!workoutStarted) {
		return (
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body">
						<h1 className="text-3xl font-bold mb-4 text-center">Ready to Start?</h1>
						
						<div className="bg-base-200 p-6 rounded-lg mb-6">
							<h2 className="text-xl font-semibold mb-4">Today's Workout Overview</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="stat bg-base-100 rounded-lg">
									<div className="stat-title">Total Sets</div>
									<div className="stat-value text-primary">{totalSets}</div>
								</div>
								<div className="stat bg-base-100 rounded-lg">
									<div className="stat-title">Exercises per Set</div>
									<div className="stat-value text-secondary">{totalExercises}</div>
								</div>
								<div className="stat bg-base-100 rounded-lg">
									<div className="stat-title">Total Exercises</div>
									<div className="stat-value text-accent">{getTotalExercisesCount()}</div>
								</div>
							</div>
						</div>

						<div className="space-y-3 mb-6">
							<h3 className="font-semibold text-lg">Exercises in Each Set:</h3>
							{todaySession.exercises.map((exercise, idx) => (
								<div key={idx} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
									<div className="badge badge-primary">{idx + 1}</div>
									<div className="flex-1">
										<div className="font-semibold">
											{exercise.exerciseId?.name || "Exercise"}
										</div>
										<div className="text-sm opacity-70">
											{exercise.reps} reps × {totalSets} sets
											{exercise.load > 0 && ` @ ${exercise.load}kg`}
										</div>
									</div>
									{exercise.exerciseId?.primary_muscles && (
										<div className="badge badge-outline">
											{exercise.exerciseId.primary_muscles[0]}
										</div>
									)}
								</div>
							))}
						</div>

						<div className="alert alert-info">
							<Dumbbell className="w-5 h-5" />
							<div>
								<h4 className="font-bold">How it works:</h4>
								<p className="text-sm">
									Complete all exercises in sequence for one set, then rest before the next set. 
									You'll have 30s rest between exercises and 90s between sets.
								</p>
							</div>
						</div>

						<div className="card-actions justify-center mt-6">
							<button
								onClick={handleStartWorkout}
								className="btn btn-primary btn-lg gap-2"
							>
								<Play className="w-6 h-6" />
								Start Workout
							</button>
							<button
								onClick={() => navigate("/dashboard")}
								className="btn btn-ghost btn-lg"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Rest Screen
	if (isResting) {
		const isSetRest = currentExerciseInSet >= totalExercises - 1;
		return (
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body items-center text-center">
						<h2 className="text-2xl font-bold mb-4">
							{isSetRest ? `Set ${currentSetNumber} Complete! 🎉` : "Rest Time"}
						</h2>
						
						<div className="radial-progress text-primary mb-6" 
							style={{ 
								"--value": (restTimeLeft / (isSetRest ? 90 : 30)) * 100,
								"--size": "12rem",
								"--thickness": "1rem"
							}}
							role="progressbar"
						>
							<div className="text-center">
								<div className="text-5xl font-bold">{restTimeLeft}</div>
								<div className="text-sm opacity-70">seconds</div>
							</div>
						</div>

						<div className="text-lg mb-6">
							{isSetRest ? (
								<>
									<p className="font-semibold mb-2">Great job!</p>
									<p className="opacity-70">Next: Set {currentSetNumber + 1}</p>
								</>
							) : (
								<>
									<p className="opacity-70">Next exercise:</p>
									<p className="font-semibold">
										{todaySession.exercises[currentExerciseInSet + 1]?.exerciseId?.name}
									</p>
								</>
							)}
						</div>

						<button
							onClick={handleSkipRest}
							className="btn btn-outline btn-primary gap-2"
						>
							Skip Rest
							<ArrowRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Active Exercise Screen
	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<button
					onClick={() => setShowExitModal(true)}
					className="btn btn-ghost btn-sm gap-2"
				>
					<X className="w-4 h-4" />
					Exit
				</button>
				<div className="flex items-center gap-3">
					<div className="badge badge-primary badge-lg">
						<Clock className="w-3 h-3 mr-1" />
						{formatTime(totalWorkoutTime)}
					</div>
					<div className="text-sm font-medium">
						{getCompletedExercisesCount()} / {getTotalExercisesCount()}
					</div>
				</div>
			</div>

			{/* Progress Bar */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium">Progress</span>
					<span className="text-sm opacity-70">
						Set {currentSetNumber} of {totalSets} • Exercise {currentExerciseInSet + 1} of {totalExercises}
					</span>
				</div>
				<progress
					className="progress progress-primary w-full h-3"
					value={getProgressPercentage()}
					max="100"
				></progress>
			</div>

			{/* Exercise Card */}
			<div className="card bg-linear-to-br from-primary/10 to-secondary/10 shadow-xl mb-6">
				<div className="card-body">
					<div className="text-center mb-6">
						<div className="badge badge-primary badge-lg mb-2">
							Set {currentSetNumber}
						</div>
						<h1 className="text-3xl font-bold mb-2">
							{currentExerciseData?.name || "Exercise"}
						</h1>
						<p className="text-lg opacity-70">
							Exercise {currentExerciseInSet + 1} of {totalExercises}
						</p>
					</div>

					{/* Exercise Info */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div className="bg-base-100 p-4 rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<Dumbbell className="w-5 h-5 text-primary" />
								<span className="font-semibold">Target</span>
							</div>
							<div className="text-2xl font-bold">
								{currentLog?.plannedReps} reps
								{currentLog?.plannedLoad > 0 && (
									<span className="text-lg ml-2">@ {currentLog.plannedLoad}kg</span>
								)}
							</div>
						</div>

						{currentExerciseData?.primary_muscles && (
							<div className="bg-base-100 p-4 rounded-lg">
								<div className="font-semibold mb-2">Target Muscles</div>
								<div className="flex flex-wrap gap-2">
									{currentExerciseData.primary_muscles.map((muscle, idx) => (
										<span key={idx} className="badge badge-primary">
											{muscle}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					{currentExerciseData?.description && (
						<div className="alert alert-info mb-6">
							<div>
								<div className="font-semibold mb-1">How to perform:</div>
								<p className="text-sm">{currentExerciseData.description}</p>
							</div>
						</div>
					)}

					{/* Reps Input */}
					<div className="card bg-base-100 shadow-lg mb-6">
						<div className="card-body">
							<h3 className="card-title text-lg mb-4">Log Your Performance</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">Reps Completed</span>
									</label>
									<input
										type="number"
										value={currentLog?.actualReps || 0}
										onChange={(e) => handleRepsChange(e.target.value)}
										className="input input-bordered input-lg text-center text-2xl font-bold"
										min="0"
										disabled={currentLog?.completed}
									/>
								</div>

								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold">Weight (kg)</span>
									</label>
									<input
										type="number"
										step="0.5"
										value={currentLog?.actualLoad || 0}
										onChange={(e) => handleLoadChange(e.target.value)}
										className="input input-bordered input-lg text-center text-2xl font-bold"
										min="0"
										disabled={currentLog?.completed}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Complete Button */}
					<button
						onClick={handleExerciseComplete}
						className="btn btn-primary btn-lg w-full gap-2"
						disabled={currentLog?.completed}
					>
						{currentLog?.completed ? (
							<>
								<CheckCircle className="w-6 h-6" />
								Completed
							</>
						) : (
							<>
								<Check className="w-6 h-6" />
								Complete Exercise
							</>
						)}
					</button>
				</div>
			</div>

			{/* Exit Confirmation Modal */}
			{showExitModal && (
				<dialog className="modal modal-open">
					<div className="modal-box">
						<h3 className="font-bold text-lg mb-4">
							Exit Workout?
						</h3>
						<p className="mb-6">
							Your progress will not be saved. Are you sure you want to exit?
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
