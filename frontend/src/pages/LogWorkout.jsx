import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDailySessionStore } from "../store/dailySession/dailySessionStore";
import { useSessionLogStore } from "../store/sessionLog/sessionLogStore";
import ExerciseTracker from "../components/workout/ExerciseTracker";
import SessionSummary from "../components/workout/SessionSummary";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const LogWorkout = () => {
	const navigate = useNavigate();
	const {
		getTodaySession,
		session,
		isLoading: sessionLoading,
	} = useDailySessionStore();
	const { submitSessionLog, isLoading: submitting } = useSessionLogStore();

	const [workoutEntries, setWorkoutEntries] = useState([]);
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [showSummary, setShowSummary] = useState(false);
	const [startTime, setStartTime] = useState(null);

	useEffect(() => {
		loadTodaySession();
		setStartTime(new Date());
	}, []);

	const loadTodaySession = async () => {
		const result = await getTodaySession();
		if (result.success && result.data) {
			// Initialize workout entries from session exercises
			const entries = result.data.exercises.map((ex) => ({
				exerciseId: ex.exerciseId._id || ex.exerciseId,
				exerciseName: ex.exerciseId.name || "Exercise",
				planned: ex.planned || {},
				actual: {
					sets: ex.planned?.sets || 3,
					reps: ex.planned?.reps || 8,
					load_kg: ex.planned?.load_kg || 0,
					time_seconds: ex.planned?.time_seconds || 0,
				},
				status: "pending", // pending, done, skipped
				rpe: null,
				notes: "",
				setLogs: [], // Track individual sets
			}));
			setWorkoutEntries(entries);
		} else {
			toast.error("No workout scheduled for today");
			navigate("/today-workout");
		}
	};

	const handleUpdateEntry = (index, updatedEntry) => {
		const newEntries = [...workoutEntries];
		newEntries[index] = updatedEntry;
		setWorkoutEntries(newEntries);
	};

	const handleNext = () => {
		if (currentExerciseIndex < workoutEntries.length - 1) {
			setCurrentExerciseIndex(currentExerciseIndex + 1);
		} else {
			setShowSummary(true);
		}
	};

	const handlePrevious = () => {
		if (showSummary) {
			setShowSummary(false);
		} else if (currentExerciseIndex > 0) {
			setCurrentExerciseIndex(currentExerciseIndex - 1);
		}
	};

	const handleEditExercise = (index) => {
		setShowSummary(false);
		setCurrentExerciseIndex(index);
	};

	const handleSubmit = async () => {
		// Format entries for backend
		const today = new Date().toISOString().split("T")[0];
		const formattedEntries = workoutEntries.map((entry) => ({
			exerciseId: entry.exerciseId,
			status: entry.status,
			actual: entry.actual,
			rpe: entry.rpe,
			notes: entry.notes,
		}));

		const result = await submitSessionLog(today, formattedEntries);

		if (result.success) {
			const duration = Math.round((new Date() - startTime) / 60000); // minutes
			toast.success(`Workout logged! Duration: ${duration} minutes`);
			navigate("/workout-history");
		} else {
			toast.error(result.message || "Failed to log workout");
		}
	};

	const handleCancel = () => {
		if (
			confirm(
				"Are you sure you want to cancel? Your progress will be lost."
			)
		) {
			navigate("/today-workout");
		}
	};

	if (sessionLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader />
			</div>
		);
	}

	if (!session || workoutEntries.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">
						No Workout Available
					</h2>
					<p className="mb-4">
						You don't have a workout scheduled for today.
					</p>
					<button
						onClick={() => navigate("/today-workout")}
						className="btn btn-primary"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	const currentEntry = workoutEntries[currentExerciseIndex];
	const completedCount = workoutEntries.filter(
		(e) => e.status === "done"
	).length;
	const progress = Math.round((completedCount / workoutEntries.length) * 100);

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			{/* Header */}
			<div className="mb-6">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-3xl font-bold">Log Workout</h1>
					<button
						onClick={handleCancel}
						className="btn btn-ghost btn-sm"
					>
						Cancel
					</button>
				</div>

				{/* Progress Bar */}
				<div className="mb-4">
					<div className="flex justify-between text-sm mb-2">
						<span>Progress</span>
						<span>
							{completedCount} / {workoutEntries.length} exercises
						</span>
					</div>
					<progress
						className="progress progress-primary w-full"
						value={progress}
						max="100"
					></progress>
				</div>

				{/* Exercise Navigation */}
				{!showSummary && (
					<div className="flex justify-center gap-2 flex-wrap">
						{workoutEntries.map((entry, index) => (
							<button
								key={index}
								onClick={() => setCurrentExerciseIndex(index)}
								className={`btn btn-sm ${
									index === currentExerciseIndex
										? "btn-primary"
										: entry.status === "done"
										? "btn-success"
										: entry.status === "skipped"
										? "btn-warning"
										: "btn-ghost"
								}`}
							>
								{index + 1}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Main Content */}
			{showSummary ? (
				<SessionSummary
					entries={workoutEntries}
					onEdit={handleEditExercise}
					onSubmit={handleSubmit}
					onBack={handlePrevious}
					isSubmitting={submitting}
				/>
			) : (
				<ExerciseTracker
					entry={currentEntry}
					exerciseNumber={currentExerciseIndex + 1}
					totalExercises={workoutEntries.length}
					onUpdate={(updatedEntry) =>
						handleUpdateEntry(currentExerciseIndex, updatedEntry)
					}
					onNext={handleNext}
					onPrevious={handlePrevious}
					isFirst={currentExerciseIndex === 0}
					isLast={currentExerciseIndex === workoutEntries.length - 1}
				/>
			)}
		</div>
	);
};

export default LogWorkout;
