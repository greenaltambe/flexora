import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const SetLogger = ({ planned, setNumber, onSetComplete, previousSet }) => {
	const [reps, setReps] = useState(planned?.reps || 8);
	const [loadKg, setLoadKg] = useState(planned?.load_kg || 0);
	const [timeSeconds, setTimeSeconds] = useState(planned?.time_seconds || 0);
	const [isWarmup, setIsWarmup] = useState(false);
	const [restTimer, setRestTimer] = useState(null);
	const [timeRemaining, setTimeRemaining] = useState(0);

	useEffect(() => {
		// Initialize with previous set values if available
		if (previousSet && !isWarmup) {
			setReps(previousSet.reps || reps);
			setLoadKg(previousSet.load_kg || loadKg);
			setTimeSeconds(previousSet.time_seconds || timeSeconds);
		}
	}, [previousSet]);

	useEffect(() => {
		// Cleanup timer on unmount
		return () => {
			if (restTimer) {
				clearInterval(restTimer);
			}
		};
	}, [restTimer]);

	const handleLogSet = () => {
		if (reps <= 0 && timeSeconds <= 0) {
			toast.error("Please enter reps or time");
			return;
		}

		const setData = {
			reps: parseInt(reps) || 0,
			load_kg: parseFloat(loadKg) || 0,
			time_seconds: parseInt(timeSeconds) || 0,
			isWarmup,
		};

		onSetComplete(setData);
		toast.success(`Set ${setNumber} logged!`);

		// Start rest timer if rest time is specified
		if (planned?.rest_seconds && !isWarmup) {
			startRestTimer(planned.rest_seconds);
		}

		// Reset warmup flag for next set
		setIsWarmup(false);
	};

	const startRestTimer = (seconds) => {
		setTimeRemaining(seconds);
		const timer = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					setRestTimer(null);
					toast.success("Rest complete! Ready for next set");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		setRestTimer(timer);
	};

	const stopRestTimer = () => {
		if (restTimer) {
			clearInterval(restTimer);
			setRestTimer(null);
			setTimeRemaining(0);
		}
	};

	const handleCopyPrevious = () => {
		if (previousSet) {
			setReps(previousSet.reps || reps);
			setLoadKg(previousSet.load_kg || loadKg);
			setTimeSeconds(previousSet.time_seconds || timeSeconds);
			toast.success("Copied from previous set");
		}
	};

	const incrementValue = (setter, value, step) => {
		setter(Math.max(0, value + step));
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${String(secs).padStart(2, "0")}`;
	};

	return (
		<div className="card bg-base-300">
			<div className="card-body">
				<div className="flex justify-between items-center mb-4">
					<h3 className="font-semibold text-lg">
						Log Set {setNumber}
						{isWarmup && (
							<span className="badge badge-info ml-2">
								Warmup
							</span>
						)}
					</h3>
					{previousSet && (
						<button
							onClick={handleCopyPrevious}
							className="btn btn-ghost btn-sm"
						>
							📋 Copy Previous
						</button>
					)}
				</div>

				{/* Rest Timer */}
				{timeRemaining > 0 && (
					<div className="alert alert-warning mb-4">
						<div className="flex-1">
							<div className="font-semibold">Rest Timer</div>
							<div className="text-2xl font-mono">
								{formatTime(timeRemaining)}
							</div>
						</div>
						<button
							onClick={stopRestTimer}
							className="btn btn-sm btn-ghost"
						>
							Skip
						</button>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					{/* Reps */}
					{(planned?.reps || !planned?.time_seconds) && (
						<div className="form-control">
							<label className="label">
								<span className="label-text">Reps</span>
								<span className="label-text-alt text-primary">
									Target: {planned?.reps || "-"}
								</span>
							</label>
							<div className="join">
								<button
									className="btn join-item"
									onClick={() =>
										incrementValue(setReps, reps, -1)
									}
								>
									−
								</button>
								<input
									type="number"
									value={reps}
									onChange={(e) =>
										setReps(parseInt(e.target.value) || 0)
									}
									className="input input-bordered join-item w-full text-center"
									min="0"
								/>
								<button
									className="btn join-item"
									onClick={() =>
										incrementValue(setReps, reps, 1)
									}
								>
									+
								</button>
							</div>
						</div>
					)}

					{/* Load */}
					{planned?.load_kg !== undefined && (
						<div className="form-control">
							<label className="label">
								<span className="label-text">Load (kg)</span>
								<span className="label-text-alt text-primary">
									Target: {planned?.load_kg || "-"}
								</span>
							</label>
							<div className="join">
								<button
									className="btn join-item"
									onClick={() =>
										incrementValue(setLoadKg, loadKg, -2.5)
									}
								>
									−
								</button>
								<input
									type="number"
									value={loadKg}
									onChange={(e) =>
										setLoadKg(
											parseFloat(e.target.value) || 0
										)
									}
									className="input input-bordered join-item w-full text-center"
									step="2.5"
									min="0"
								/>
								<button
									className="btn join-item"
									onClick={() =>
										incrementValue(setLoadKg, loadKg, 2.5)
									}
								>
									+
								</button>
							</div>
						</div>
					)}

					{/* Time */}
					{planned?.time_seconds && (
						<div className="form-control">
							<label className="label">
								<span className="label-text">
									Time (seconds)
								</span>
								<span className="label-text-alt text-primary">
									Target: {planned.time_seconds}s
								</span>
							</label>
							<div className="join">
								<button
									className="btn join-item"
									onClick={() =>
										incrementValue(
											setTimeSeconds,
											timeSeconds,
											-5
										)
									}
								>
									−
								</button>
								<input
									type="number"
									value={timeSeconds}
									onChange={(e) =>
										setTimeSeconds(
											parseInt(e.target.value) || 0
										)
									}
									className="input input-bordered join-item w-full text-center"
									min="0"
								/>
								<button
									className="btn join-item"
									onClick={() =>
										incrementValue(
											setTimeSeconds,
											timeSeconds,
											5
										)
									}
								>
									+
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Warmup Toggle */}
				<div className="form-control mb-4">
					<label className="label cursor-pointer justify-start gap-3">
						<input
							type="checkbox"
							checked={isWarmup}
							onChange={(e) => setIsWarmup(e.target.checked)}
							className="checkbox checkbox-primary"
						/>
						<span className="label-text">This is a warmup set</span>
					</label>
				</div>

				{/* Log Button */}
				<button
					onClick={handleLogSet}
					className="btn btn-primary btn-block"
					disabled={timeRemaining > 0}
				>
					{timeRemaining > 0
						? `Rest ${formatTime(timeRemaining)}`
						: `Log Set ${setNumber}`}
				</button>

				{/* Quick Actions */}
				<div className="flex gap-2 mt-2">
					<button
						className="btn btn-sm btn-ghost flex-1"
						onClick={() => {
							setReps(planned?.reps || 8);
							setLoadKg(planned?.load_kg || 0);
							setTimeSeconds(planned?.time_seconds || 0);
						}}
					>
						Reset to Planned
					</button>
					{planned?.load_kg && (
						<button
							className="btn btn-sm btn-ghost"
							onClick={() =>
								incrementValue(setLoadKg, loadKg, 2.5)
							}
						>
							+2.5kg
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default SetLogger;
