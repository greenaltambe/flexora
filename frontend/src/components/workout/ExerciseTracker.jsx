import { useState, useEffect } from "react";
import SetLogger from "./SetLogger";

const ExerciseTracker = ({
	entry,
	exerciseNumber,
	totalExercises,
	onUpdate,
	onNext,
	onPrevious,
	isFirst,
	isLast,
}) => {
	const [localEntry, setLocalEntry] = useState(entry);
	const [activeTab, setActiveTab] = useState("perform"); // perform, details

	useEffect(() => {
		setLocalEntry(entry);
	}, [entry]);

	const handleSetComplete = (setData) => {
		const newSetLogs = [...(localEntry.setLogs || []), setData];
		const updatedEntry = {
			...localEntry,
			setLogs: newSetLogs,
			actual: calculateActualFromSets(newSetLogs),
		};
		setLocalEntry(updatedEntry);
		onUpdate(updatedEntry);
	};

	const handleRemoveSet = (index) => {
		const newSetLogs = localEntry.setLogs.filter((_, i) => i !== index);
		const updatedEntry = {
			...localEntry,
			setLogs: newSetLogs,
			actual: calculateActualFromSets(newSetLogs),
		};
		setLocalEntry(updatedEntry);
		onUpdate(updatedEntry);
	};

	const calculateActualFromSets = (setLogs) => {
		if (setLogs.length === 0) {
			return localEntry.actual;
		}

		// Calculate average or use last set values
		const lastSet = setLogs[setLogs.length - 1];
		return {
			sets: setLogs.length,
			reps: lastSet.reps,
			load_kg: lastSet.load_kg || 0,
			time_seconds: lastSet.time_seconds || 0,
		};
	};

	const handleStatusChange = (status) => {
		const updatedEntry = {
			...localEntry,
			status,
		};
		setLocalEntry(updatedEntry);
		onUpdate(updatedEntry);
	};

	const handleRPEChange = (rpe) => {
		const updatedEntry = {
			...localEntry,
			rpe: parseInt(rpe),
		};
		setLocalEntry(updatedEntry);
		onUpdate(updatedEntry);
	};

	const handleNotesChange = (notes) => {
		const updatedEntry = {
			...localEntry,
			notes,
		};
		setLocalEntry(updatedEntry);
		onUpdate(updatedEntry);
	};

	const handleMarkAsDone = () => {
		const completed = localEntry.setLogs.length >= localEntry.planned.sets;
		if (!completed) {
			if (
				!confirm(
					"You haven't completed all planned sets. Mark as done anyway?"
				)
			) {
				return;
			}
		}
		handleStatusChange("done");
		setTimeout(onNext, 300);
	};

	const handleSkip = () => {
		handleStatusChange("skipped");
		setTimeout(onNext, 300);
	};

	const planned = localEntry.planned || {};
	const setsCompleted = localEntry.setLogs?.length || 0;
	const setsPlanned = planned.sets || 3;

	return (
		<div className="card bg-base-200 shadow-xl">
			<div className="card-body">
				{/* Exercise Header */}
				<div className="mb-6">
					<div className="flex justify-between items-start mb-2">
						<div>
							<span className="badge badge-primary mb-2">
								Exercise {exerciseNumber} of {totalExercises}
							</span>
							<h2 className="text-2xl font-bold">
								{localEntry.exerciseName}
							</h2>
						</div>
						<div className="flex gap-2">
							{localEntry.status === "done" && (
								<span className="badge badge-success badge-lg">
									✓ Done
								</span>
							)}
							{localEntry.status === "skipped" && (
								<span className="badge badge-warning badge-lg">
									Skipped
								</span>
							)}
						</div>
					</div>

					{/* Planned Prescription */}
					<div className="bg-base-300 p-4 rounded-lg mb-4">
						<h3 className="font-semibold mb-2">Planned Workout:</h3>
						<div className="flex gap-4 flex-wrap">
							{planned.sets && (
								<div>
									<span className="text-sm opacity-70">
										Sets:
									</span>
									<span className="font-bold ml-2">
										{planned.sets}
									</span>
								</div>
							)}
							{planned.reps && (
								<div>
									<span className="text-sm opacity-70">
										Reps:
									</span>
									<span className="font-bold ml-2">
										{planned.reps}
									</span>
								</div>
							)}
							{planned.load_kg > 0 && (
								<div>
									<span className="text-sm opacity-70">
										Load:
									</span>
									<span className="font-bold ml-2">
										{planned.load_kg} kg
									</span>
								</div>
							)}
							{planned.time_seconds > 0 && (
								<div>
									<span className="text-sm opacity-70">
										Time:
									</span>
									<span className="font-bold ml-2">
										{Math.floor(planned.time_seconds / 60)}:
										{String(
											planned.time_seconds % 60
										).padStart(2, "0")}
									</span>
								</div>
							)}
							{planned.rest_seconds && (
								<div>
									<span className="text-sm opacity-70">
										Rest:
									</span>
									<span className="font-bold ml-2">
										{planned.rest_seconds}s
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Tabs */}
					<div className="tabs tabs-boxed mb-4">
						<a
							className={`tab ${
								activeTab === "perform" ? "tab-active" : ""
							}`}
							onClick={() => setActiveTab("perform")}
						>
							Perform
						</a>
						<a
							className={`tab ${
								activeTab === "details" ? "tab-active" : ""
							}`}
							onClick={() => setActiveTab("details")}
						>
							Details
						</a>
					</div>
				</div>

				{/* Tab Content */}
				{activeTab === "perform" ? (
					<div>
						{/* Sets Progress */}
						<div className="mb-6">
							<div className="flex justify-between items-center mb-2">
								<h3 className="font-semibold">
									Sets Completed
								</h3>
								<span className="badge">
									{setsCompleted} / {setsPlanned}
								</span>
							</div>

							{/* Completed Sets */}
							{localEntry.setLogs &&
								localEntry.setLogs.length > 0 && (
									<div className="space-y-2 mb-4">
										{localEntry.setLogs.map(
											(set, index) => (
												<div
													key={index}
													className="flex items-center justify-between bg-base-300 p-3 rounded-lg"
												>
													<div className="flex gap-4">
														<span className="font-bold">
															Set {index + 1}
														</span>
														{set.reps && (
															<span>
																{set.reps} reps
															</span>
														)}
														{set.load_kg > 0 && (
															<span>
																{set.load_kg} kg
															</span>
														)}
														{set.time_seconds >
															0 && (
															<span>
																{Math.floor(
																	set.time_seconds /
																		60
																)}
																:
																{String(
																	set.time_seconds %
																		60
																).padStart(
																	2,
																	"0"
																)}
															</span>
														)}
													</div>
													<button
														onClick={() =>
															handleRemoveSet(
																index
															)
														}
														className="btn btn-ghost btn-sm btn-circle"
													>
														✕
													</button>
												</div>
											)
										)}
									</div>
								)}

							{/* Set Logger */}
							{localEntry.status !== "done" &&
								localEntry.status !== "skipped" && (
									<SetLogger
										planned={planned}
										setNumber={setsCompleted + 1}
										onSetComplete={handleSetComplete}
										previousSet={
											localEntry.setLogs?.[
												localEntry.setLogs.length - 1
											]
										}
									/>
								)}
						</div>

						{/* Quick Actions */}
						<div className="flex gap-2 flex-wrap">
							{localEntry.status !== "done" && (
								<button
									onClick={handleMarkAsDone}
									className="btn btn-success flex-1"
									disabled={setsCompleted === 0}
								>
									Mark as Done
								</button>
							)}
							<button
								onClick={handleSkip}
								className="btn btn-warning"
							>
								Skip Exercise
							</button>
						</div>
					</div>
				) : (
					<div>
						{/* RPE */}
						<div className="form-control mb-4">
							<label className="label">
								<span className="label-text">
									RPE (Rate of Perceived Exertion)
								</span>
								<span className="label-text-alt">
									{localEntry.rpe || "Not set"}
								</span>
							</label>
							<input
								type="range"
								min="1"
								max="10"
								value={localEntry.rpe || 5}
								onChange={(e) =>
									handleRPEChange(e.target.value)
								}
								className="range range-primary"
								step="1"
							/>
							<div className="w-full flex justify-between text-xs px-2 mt-1">
								<span>1</span>
								<span>2</span>
								<span>3</span>
								<span>4</span>
								<span>5</span>
								<span>6</span>
								<span>7</span>
								<span>8</span>
								<span>9</span>
								<span>10</span>
							</div>
						</div>

						{/* Notes */}
						<div className="form-control mb-4">
							<label className="label">
								<span className="label-text">Notes</span>
							</label>
							<textarea
								className="textarea textarea-bordered h-24"
								placeholder="How did it feel? Any issues?"
								value={localEntry.notes}
								onChange={(e) =>
									handleNotesChange(e.target.value)
								}
							></textarea>
						</div>

						{/* Summary */}
						<div className="alert alert-info">
							<div>
								<div className="font-semibold">Summary</div>
								<div className="text-sm">
									Completed {setsCompleted} of {setsPlanned}{" "}
									sets
									{localEntry.rpe &&
										` • RPE: ${localEntry.rpe}/10`}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Navigation */}
				<div className="divider"></div>
				<div className="flex justify-between">
					<button
						onClick={onPrevious}
						className="btn btn-ghost"
						disabled={isFirst}
					>
						← Previous
					</button>
					<button onClick={onNext} className="btn btn-primary">
						{isLast ? "Review →" : "Next →"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ExerciseTracker;
