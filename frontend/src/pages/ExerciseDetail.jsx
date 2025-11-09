import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	ArrowLeft,
	Edit,
	Dumbbell,
	Timer,
	Target,
	TrendingUp,
} from "lucide-react";
import exerciseStore from "../store/exercise/exerciseStore";
import { useAuthStore } from "../store/auth/authStore";
import Loader from "../components/Loader";

const ExerciseDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { getExerciseById, isLoading } = exerciseStore();
	const [exercise, setExercise] = useState(null);
	const isAdmin = user?.role === "admin";

	useEffect(() => {
		loadExercise();
	}, [id]);

	const loadExercise = async () => {
		const result = await getExerciseById(id);
		if (result.success) {
			setExercise(result.data);
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader />
			</div>
		);
	}

	if (!exercise) {
		return (
			<div className="max-w-4xl mx-auto p-4">
				<div className="alert alert-error">
					<span>Exercise not found</span>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto p-4">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<button
					onClick={() => navigate(-1)}
					className="btn btn-ghost btn-sm gap-2"
				>
					<ArrowLeft className="w-4 h-4" />
					Back
				</button>

				{isAdmin && (
					<Link
						to={`/admin/exercises/edit/${id}`}
						className="btn btn-warning btn-sm gap-2"
					>
						<Edit className="w-4 h-4" />
						Edit Exercise
					</Link>
				)}
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Main Info */}
				<div className="lg:col-span-2 space-y-6">
					{/* Title Card */}
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
								<Dumbbell className="w-8 h-8 text-primary" />
								{exercise.name}
							</h1>

							{exercise.description && (
								<p className="text-base-content/70 text-lg">
									{exercise.description}
								</p>
							)}

							{/* Badges */}
							<div className="flex flex-wrap gap-2 mt-4">
								<span
									className={`badge badge-lg ${
										exercise.difficulty === "beginner"
											? "badge-success"
											: exercise.difficulty ===
											  "intermediate"
											? "badge-warning"
											: "badge-error"
									}`}
								>
									{exercise.difficulty}
								</span>
								<span className="badge badge-lg badge-ghost">
									{exercise.type}
								</span>
								{exercise.modality && (
									<span className="badge badge-lg badge-info">
										{exercise.modality}
									</span>
								)}
							</div>
						</div>
					</div>

					{/* Instructions */}
					{exercise.instructions &&
						exercise.instructions.length > 0 && (
							<div className="card bg-base-100 shadow-lg">
								<div className="card-body">
									<h2 className="card-title text-2xl mb-4">
										How to Perform
									</h2>
									<ol className="list-decimal list-inside space-y-3">
										{exercise.instructions.map(
											(instruction, index) => (
												<li
													key={index}
													className="text-base-content/80 leading-relaxed"
												>
													{instruction}
												</li>
											)
										)}
									</ol>
								</div>
							</div>
						)}

					{/* Video */}
					{exercise.video_url && (
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h2 className="card-title text-2xl mb-4">
									Video Demonstration
								</h2>
								<div className="aspect-video bg-base-300 rounded-lg overflow-hidden">
									<iframe
										src={exercise.video_url}
										className="w-full h-full"
										allowFullScreen
										title={exercise.name}
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Right Column - Details */}
				<div className="space-y-6">
					{/* Quick Stats */}
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h2 className="card-title text-xl mb-4">
								Quick Stats
							</h2>

							<div className="space-y-4">
								{exercise.estimated_minutes && (
									<div className="flex items-center gap-3">
										<Timer className="w-5 h-5 text-primary" />
										<div>
											<div className="text-xs text-base-content/60">
												Duration
											</div>
											<div className="font-semibold">
												{exercise.estimated_minutes} min
											</div>
										</div>
									</div>
								)}

								<div className="flex items-center gap-3">
									<TrendingUp className="w-5 h-5 text-secondary" />
									<div>
										<div className="text-xs text-base-content/60">
											Level
										</div>
										<div className="font-semibold capitalize">
											{exercise.difficulty}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<Target className="w-5 h-5 text-accent" />
									<div>
										<div className="text-xs text-base-content/60">
											Type
										</div>
										<div className="font-semibold capitalize">
											{exercise.type}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Target Muscles */}
					<div className="card bg-base-100 shadow-lg">
						<div className="card-body">
							<h2 className="card-title text-xl mb-4">
								Target Muscles
							</h2>

							{exercise.primary_muscles &&
								exercise.primary_muscles.length > 0 && (
									<div className="mb-4">
										<h3 className="text-sm font-semibold mb-2 text-base-content/70">
											Primary
										</h3>
										<div className="flex flex-wrap gap-2">
											{exercise.primary_muscles.map(
												(muscle, index) => (
													<span
														key={index}
														className="badge badge-primary"
													>
														{muscle}
													</span>
												)
											)}
										</div>
									</div>
								)}

							{exercise.secondary_muscles &&
								exercise.secondary_muscles.length > 0 && (
									<div>
										<h3 className="text-sm font-semibold mb-2 text-base-content/70">
											Secondary
										</h3>
										<div className="flex flex-wrap gap-2">
											{exercise.secondary_muscles.map(
												(muscle, index) => (
													<span
														key={index}
														className="badge badge-secondary badge-outline"
													>
														{muscle}
													</span>
												)
											)}
										</div>
									</div>
								)}
						</div>
					</div>

					{/* Equipment */}
					{exercise.equipment && exercise.equipment.length > 0 && (
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h2 className="card-title text-xl mb-4">
									Equipment Needed
								</h2>
								<div className="flex flex-wrap gap-2">
									{exercise.equipment.map((eq, index) => (
										<span
											key={index}
											className="badge badge-accent"
										>
											{eq}
										</span>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Default Prescription */}
					{exercise.default_prescription && (
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h2 className="card-title text-xl mb-4">
									Recommended
								</h2>
								<div className="space-y-3">
									{exercise.default_prescription.sets && (
										<div className="flex justify-between">
											<span className="text-base-content/70">
												Sets
											</span>
											<span className="font-semibold">
												{
													exercise
														.default_prescription
														.sets
												}
											</span>
										</div>
									)}
									{exercise.default_prescription.reps && (
										<div className="flex justify-between">
											<span className="text-base-content/70">
												Reps
											</span>
											<span className="font-semibold">
												{
													exercise
														.default_prescription
														.reps
												}
											</span>
										</div>
									)}
									{exercise.default_prescription
										.duration_seconds && (
										<div className="flex justify-between">
											<span className="text-base-content/70">
												Duration
											</span>
											<span className="font-semibold">
												{
													exercise
														.default_prescription
														.duration_seconds
												}
												s
											</span>
										</div>
									)}
									{exercise.default_prescription
										.rest_seconds && (
										<div className="flex justify-between">
											<span className="text-base-content/70">
												Rest
											</span>
											<span className="font-semibold">
												{
													exercise
														.default_prescription
														.rest_seconds
												}
												s
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Tags */}
					{exercise.tags && exercise.tags.length > 0 && (
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h2 className="card-title text-xl mb-4">
									Tags
								</h2>
								<div className="flex flex-wrap gap-2">
									{exercise.tags.map((tag, index) => (
										<span
											key={index}
											className="badge badge-ghost"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ExerciseDetail;
