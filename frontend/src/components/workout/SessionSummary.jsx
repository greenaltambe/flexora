const SessionSummary = ({
	entries,
	onEdit,
	onSubmit,
	onBack,
	isSubmitting,
}) => {
	const completedExercises = entries.filter(
		(e) => e.status === "done"
	).length;
	const skippedExercises = entries.filter(
		(e) => e.status === "skipped"
	).length;
	const totalVolume = entries.reduce((sum, entry) => {
		if (entry.status === "done" && entry.actual) {
			return (
				sum +
				entry.actual.sets * entry.actual.reps * entry.actual.load_kg
			);
		}
		return sum;
	}, 0);

	const formatDuration = (sets, restSeconds) => {
		if (!restSeconds) return "-";
		const totalSeconds = sets * restSeconds;
		const minutes = Math.floor(totalSeconds / 60);
		return `~${minutes} min`;
	};

	return (
		<div className="space-y-6">
			{/* Summary Stats */}
			<div className="stats stats-vertical lg:stats-horizontal shadow w-full">
				<div className="stat">
					<div className="stat-figure text-primary">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="inline-block w-8 h-8 stroke-current"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							></path>
						</svg>
					</div>
					<div className="stat-title">Completed</div>
					<div className="stat-value text-primary">
						{completedExercises}
					</div>
					<div className="stat-desc">
						of {entries.length} exercises
					</div>
				</div>

				<div className="stat">
					<div className="stat-figure text-secondary">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="inline-block w-8 h-8 stroke-current"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
							></path>
						</svg>
					</div>
					<div className="stat-title">Total Volume</div>
					<div className="stat-value text-secondary">
						{totalVolume.toFixed(0)}
					</div>
					<div className="stat-desc">kg lifted</div>
				</div>

				<div className="stat">
					<div className="stat-figure text-warning">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="inline-block w-8 h-8 stroke-current"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<div className="stat-title">Skipped</div>
					<div className="stat-value text-warning">
						{skippedExercises}
					</div>
					<div className="stat-desc">exercises</div>
				</div>
			</div>

			{/* Exercise Details */}
			<div className="card bg-base-200 shadow-xl">
				<div className="card-body">
					<h2 className="card-title mb-4">Workout Details</h2>

					<div className="space-y-4">
						{entries.map((entry, index) => (
							<div
								key={index}
								className={`card ${
									entry.status === "done"
										? "bg-success bg-opacity-10 border border-success"
										: entry.status === "skipped"
										? "bg-warning bg-opacity-10 border border-warning"
										: "bg-base-300"
								}`}
							>
								<div className="card-body p-4">
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<h3 className="font-bold text-lg">
													{index + 1}.{" "}
													{entry.exerciseName}
												</h3>
												{entry.status === "done" && (
													<span className="badge badge-success badge-sm">
														Done
													</span>
												)}
												{entry.status === "skipped" && (
													<span className="badge badge-warning badge-sm">
														Skipped
													</span>
												)}
											</div>

											{entry.status === "done" &&
												entry.actual && (
													<div>
														<div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-2">
															<div>
																<span className="opacity-70">
																	Sets:
																</span>
																<span className="font-semibold ml-2">
																	{
																		entry
																			.actual
																			.sets
																	}
																</span>
																<span className="opacity-50 ml-1">
																	(planned:{" "}
																	{entry
																		.planned
																		?.sets ||
																		"-"}
																	)
																</span>
															</div>
															<div>
																<span className="opacity-70">
																	Reps:
																</span>
																<span className="font-semibold ml-2">
																	{
																		entry
																			.actual
																			.reps
																	}
																</span>
																<span className="opacity-50 ml-1">
																	(planned:{" "}
																	{entry
																		.planned
																		?.reps ||
																		"-"}
																	)
																</span>
															</div>
															{entry.actual
																.load_kg >
																0 && (
																<div>
																	<span className="opacity-70">
																		Load:
																	</span>
																	<span className="font-semibold ml-2">
																		{
																			entry
																				.actual
																				.load_kg
																		}{" "}
																		kg
																	</span>
																	<span className="opacity-50 ml-1">
																		(planned:{" "}
																		{entry
																			.planned
																			?.load_kg ||
																			"-"}
																		)
																	</span>
																</div>
															)}
															{entry.actual
																.time_seconds >
																0 && (
																<div>
																	<span className="opacity-70">
																		Time:
																	</span>
																	<span className="font-semibold ml-2">
																		{
																			entry
																				.actual
																				.time_seconds
																		}
																		s
																	</span>
																</div>
															)}
														</div>

														{/* Set Logs */}
														{entry.setLogs &&
															entry.setLogs
																.length > 0 && (
																<div className="text-xs opacity-70 mb-2">
																	<span className="font-semibold">
																		Sets:{" "}
																	</span>
																	{entry.setLogs.map(
																		(
																			set,
																			setIdx
																		) => (
																			<span
																				key={
																					setIdx
																				}
																				className="mr-2"
																			>
																				{setIdx +
																					1}
																				:{" "}
																				{
																					set.reps
																				}
																				r
																				{set.load_kg >
																					0 &&
																					` @ ${set.load_kg}kg`}
																				{set.isWarmup &&
																					" (W)"}
																			</span>
																		)
																	)}
																</div>
															)}

														{entry.rpe && (
															<div className="text-sm">
																<span className="opacity-70">
																	RPE:
																</span>
																<span className="font-semibold ml-2">
																	{entry.rpe}
																	/10
																</span>
															</div>
														)}

														{entry.notes && (
															<div className="text-sm mt-2">
																<span className="opacity-70">
																	Notes:
																</span>
																<p className="text-sm opacity-90 mt-1">
																	{
																		entry.notes
																	}
																</p>
															</div>
														)}
													</div>
												)}

											{entry.status === "skipped" &&
												entry.notes && (
													<div className="text-sm">
														<span className="opacity-70">
															Reason:
														</span>
														<p className="text-sm opacity-90 mt-1">
															{entry.notes}
														</p>
													</div>
												)}
										</div>

										<button
											onClick={() => onEdit(index)}
											className="btn btn-ghost btn-sm"
										>
											Edit
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col md:flex-row gap-4">
				<button
					onClick={onBack}
					className="btn btn-ghost"
					disabled={isSubmitting}
				>
					← Back to Workout
				</button>
				<button
					onClick={onSubmit}
					className="btn btn-success flex-1"
					disabled={isSubmitting || completedExercises === 0}
				>
					{isSubmitting ? (
						<>
							<span className="loading loading-spinner"></span>
							Submitting...
						</>
					) : (
						<>✓ Complete Workout</>
					)}
				</button>
			</div>

			{completedExercises === 0 && (
				<div className="alert alert-warning">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					<span>
						You haven't completed any exercises. Please complete at
						least one exercise before submitting.
					</span>
				</div>
			)}
		</div>
	);
};

export default SessionSummary;
