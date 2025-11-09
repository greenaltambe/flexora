import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const WorkoutHistory = () => {
	const navigate = useNavigate();
	const [sessions, setSessions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedSession, setSelectedSession] = useState(null);
	const [dateRange, setDateRange] = useState({
		start: "",
		end: "",
	});

	useEffect(() => {
		loadWorkoutHistory();
	}, []);

	const loadWorkoutHistory = async () => {
		setIsLoading(true);
		try {
			// TODO: Implement actual API call to get workout history
			// For now, using mock data
			const mockSessions = [
				{
					date: "2025-11-09",
					exercises: 5,
					completed: 5,
					totalVolume: 2450,
					duration: 65,
				},
				{
					date: "2025-11-07",
					exercises: 4,
					completed: 4,
					totalVolume: 1800,
					duration: 55,
				},
			];
			setSessions(mockSessions);
			setIsLoading(false);
		} catch (error) {
			toast.error("Failed to load workout history");
			setIsLoading(false);
		}
	};

	const handleViewSession = (session) => {
		setSelectedSession(session);
	};

	const handleCloseModal = () => {
		setSelectedSession(null);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getStreakDays = () => {
		// Calculate consecutive workout days
		if (sessions.length === 0) return 0;
		let streak = 1;
		for (let i = 0; i < sessions.length - 1; i++) {
			const current = new Date(sessions[i].date);
			const next = new Date(sessions[i + 1].date);
			const diffDays = Math.round(
				(current - next) / (1000 * 60 * 60 * 24)
			);
			if (diffDays === 1) {
				streak++;
			} else {
				break;
			}
		}
		return streak;
	};

	const totalWorkouts = sessions.length;
	const totalVolume = sessions.reduce((sum, s) => sum + s.totalVolume, 0);
	const avgDuration =
		totalWorkouts > 0
			? Math.round(
					sessions.reduce((sum, s) => sum + s.duration, 0) /
						totalWorkouts
			  )
			: 0;

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader />
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Workout History</h1>
				<button
					onClick={() => navigate("/today-workout")}
					className="btn btn-primary"
				>
					Today's Workout
				</button>
			</div>

			{/* Stats Overview */}
			<div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-6">
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
								d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
							></path>
						</svg>
					</div>
					<div className="stat-title">Total Workouts</div>
					<div className="stat-value text-primary">
						{totalWorkouts}
					</div>
					<div className="stat-desc">All time</div>
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
								d="M13 10V3L4 14h7v7l9-11h-7z"
							></path>
						</svg>
					</div>
					<div className="stat-title">Current Streak</div>
					<div className="stat-value text-secondary">
						{getStreakDays()}
					</div>
					<div className="stat-desc">days</div>
				</div>

				<div className="stat">
					<div className="stat-title">Total Volume</div>
					<div className="stat-value">
						{totalVolume.toLocaleString()}
					</div>
					<div className="stat-desc">kg lifted</div>
				</div>

				<div className="stat">
					<div className="stat-title">Avg Duration</div>
					<div className="stat-value">{avgDuration}</div>
					<div className="stat-desc">minutes</div>
				</div>
			</div>

			{/* Filter Section */}
			<div className="card bg-base-200 shadow-xl mb-6">
				<div className="card-body">
					<h2 className="card-title">Filter Workouts</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="form-control">
							<label className="label">
								<span className="label-text">Start Date</span>
							</label>
							<input
								type="date"
								value={dateRange.start}
								onChange={(e) =>
									setDateRange({
										...dateRange,
										start: e.target.value,
									})
								}
								className="input input-bordered"
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">End Date</span>
							</label>
							<input
								type="date"
								value={dateRange.end}
								onChange={(e) =>
									setDateRange({
										...dateRange,
										end: e.target.value,
									})
								}
								className="input input-bordered"
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">&nbsp;</span>
							</label>
							<button className="btn btn-primary">
								Apply Filter
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Workout List */}
			{sessions.length === 0 ? (
				<div className="card bg-base-200 shadow-xl">
					<div className="card-body text-center">
						<h2 className="text-2xl font-bold mb-4">
							No Workouts Yet
						</h2>
						<p className="mb-4">
							Start your fitness journey by logging your first
							workout!
						</p>
						<button
							onClick={() => navigate("/today-workout")}
							className="btn btn-primary"
						>
							View Today's Workout
						</button>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					{sessions.map((session, index) => (
						<div
							key={index}
							className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
						>
							<div className="card-body">
								<div className="flex justify-between items-start">
									<div className="flex-1">
										<h3 className="text-xl font-bold mb-2">
											{formatDate(session.date)}
										</h3>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
											<div>
												<span className="opacity-70">
													Exercises:
												</span>
												<span className="font-semibold ml-2">
													{session.completed}/
													{session.exercises}
												</span>
											</div>
											<div>
												<span className="opacity-70">
													Volume:
												</span>
												<span className="font-semibold ml-2">
													{session.totalVolume} kg
												</span>
											</div>
											<div>
												<span className="opacity-70">
													Duration:
												</span>
												<span className="font-semibold ml-2">
													{session.duration} min
												</span>
											</div>
											<div>
												<span className="opacity-70">
													Completion:
												</span>
												<span className="font-semibold ml-2">
													{Math.round(
														(session.completed /
															session.exercises) *
															100
													)}
													%
												</span>
											</div>
										</div>
									</div>
									<button
										onClick={() =>
											handleViewSession(session)
										}
										className="btn btn-ghost btn-sm"
									>
										View Details →
									</button>
								</div>
								<progress
									className="progress progress-primary w-full mt-4"
									value={session.completed}
									max={session.exercises}
								></progress>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Session Detail Modal */}
			{selectedSession && (
				<div className="modal modal-open">
					<div className="modal-box max-w-3xl">
						<h3 className="font-bold text-lg mb-4">
							Workout Details - {formatDate(selectedSession.date)}
						</h3>
						<div className="py-4">
							<p className="text-sm opacity-70 mb-4">
								Note: Detailed session logs will be available
								once the backend integration is complete.
							</p>
							<div className="stats stats-vertical w-full">
								<div className="stat">
									<div className="stat-title">
										Exercises Completed
									</div>
									<div className="stat-value text-primary">
										{selectedSession.completed}/
										{selectedSession.exercises}
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">
										Total Volume
									</div>
									<div className="stat-value text-secondary">
										{selectedSession.totalVolume} kg
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">Duration</div>
									<div className="stat-value">
										{selectedSession.duration} min
									</div>
								</div>
							</div>
						</div>
						<div className="modal-action">
							<button onClick={handleCloseModal} className="btn">
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default WorkoutHistory;
