import { useState } from "react";
import exerciseStore from "../store/exercise/exerciseStore";
import toast from "react-hot-toast";
import { Eye, Edit, Trash2 } from "lucide-react";

const ExerciseListComponent = ({ exercises, onRefresh }) => {
	const { deleteExercise, getExerciseById } = exerciseStore();
	const [selectedExercise, setSelectedExercise] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState({});

	const handleViewDetails = async (id) => {
		const result = await getExerciseById(id);
		if (result.success) {
			setSelectedExercise(result.data);
			setShowModal(true);
		} else {
			toast.error(result.message);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this exercise?")) {
			return;
		}

		setIsDeleting((prev) => ({ ...prev, [id]: true }));
		const result = await deleteExercise(id);
		setIsDeleting((prev) => ({ ...prev, [id]: false }));

		if (result.success) {
			toast.success(result.message);
			if (onRefresh) onRefresh();
		} else {
			toast.error(result.message);
		}
	};

	const handleEdit = (id) => {
		window.location.href = `/admin/exercises/edit/${id}`;
	};

	return (
		<>
			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Primary Muscles</th>
							<th>Equipment</th>
							<th>Difficulty</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{exercises.map((exercise) => (
							<tr
								key={exercise._id || exercise.id}
								className="hover:bg-base-200"
							>
								<td>
									<button
										type="button"
										onClick={(e) => {
											e.preventDefault();
											handleViewDetails(
												exercise._id || exercise.id
											);
										}}
										className="link link-primary hover:link-secondary font-medium"
									>
										{exercise.name}
									</button>
								</td>
								<td>{exercise.type}</td>
								<td>
									{Array.isArray(exercise.primary_muscles)
										? exercise.primary_muscles.join(", ")
										: exercise.primary_muscles}
								</td>
								<td>
									{Array.isArray(exercise.equipment)
										? exercise.equipment.join(", ")
										: exercise.equipment}
								</td>
								<td>{exercise.difficulty}</td>
								<td>
									<div className="flex gap-2">
										<button
											onClick={() =>
												handleViewDetails(
													exercise._id || exercise.id
												)
											}
											className="btn btn-sm btn-info"
											title="View Details"
										>
											<Eye className="w-4 h-4" />
										</button>
										<button
											onClick={() =>
												handleEdit(
													exercise._id || exercise.id
												)
											}
											className="btn btn-sm btn-warning"
											title="Edit"
										>
											<Edit className="w-4 h-4" />
										</button>
										<button
											onClick={() =>
												handleDelete(
													exercise._id || exercise.id
												)
											}
											className="btn btn-sm btn-error"
											disabled={
												isDeleting[
													exercise._id || exercise.id
												]
											}
											title="Delete"
										>
											{isDeleting[
												exercise._id || exercise.id
											] ? (
												<span className="loading loading-spinner loading-xs"></span>
											) : (
												<Trash2 className="w-4 h-4" />
											)}
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Exercise Details Modal */}
			{showModal && selectedExercise && (
				<div className="modal modal-open">
					<div className="modal-box max-w-3xl">
						<h3 className="font-bold text-lg mb-4">
							{selectedExercise.name}
						</h3>

						<div className="space-y-4">
							<div>
								<h4 className="font-semibold">Description</h4>
								<p className="text-sm">
									{selectedExercise.description ||
										"No description"}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h4 className="font-semibold">Type</h4>
									<p className="text-sm">
										{selectedExercise.type}
									</p>
								</div>
								<div>
									<h4 className="font-semibold">
										Difficulty
									</h4>
									<p className="text-sm">
										{selectedExercise.difficulty}
									</p>
								</div>
								<div>
									<h4 className="font-semibold">Modality</h4>
									<p className="text-sm">
										{selectedExercise.modality}
									</p>
								</div>
								<div>
									<h4 className="font-semibold">
										Estimated Minutes
									</h4>
									<p className="text-sm">
										{selectedExercise.estimated_minutes} min
									</p>
								</div>
							</div>

							<div>
								<h4 className="font-semibold">
									Primary Muscles
								</h4>
								<div className="flex flex-wrap gap-2 mt-2">
									{Array.isArray(
										selectedExercise.primary_muscles
									) &&
										selectedExercise.primary_muscles.map(
											(muscle) => (
												<span
													key={muscle}
													className="badge badge-primary"
												>
													{muscle}
												</span>
											)
										)}
								</div>
							</div>

							<div>
								<h4 className="font-semibold">Equipment</h4>
								<div className="flex flex-wrap gap-2 mt-2">
									{Array.isArray(
										selectedExercise.equipment
									) &&
										selectedExercise.equipment.map((eq) => (
											<span
												key={eq}
												className="badge badge-secondary"
											>
												{eq}
											</span>
										))}
								</div>
							</div>

							{selectedExercise.tags &&
								selectedExercise.tags.length > 0 && (
									<div>
										<h4 className="font-semibold">Tags</h4>
										<div className="flex flex-wrap gap-2 mt-2">
											{selectedExercise.tags.map(
												(tag) => (
													<span
														key={tag}
														className="badge badge-accent"
													>
														{tag}
													</span>
												)
											)}
										</div>
									</div>
								)}

							{selectedExercise.default_prescription && (
								<div>
									<h4 className="font-semibold">
										Default Prescription
									</h4>
									<div className="mt-2">
										<p className="text-sm">
											Sets:{" "}
											{selectedExercise
												.default_prescription.sets ||
												"N/A"}
										</p>
										<p className="text-sm">
											Reps:{" "}
											{selectedExercise
												.default_prescription.reps ||
												"N/A"}
										</p>
										<p className="text-sm">
											Rest:{" "}
											{selectedExercise
												.default_prescription
												.rest_seconds || "N/A"}
											s
										</p>
									</div>
								</div>
							)}

							{selectedExercise.video_url && (
								<div>
									<h4 className="font-semibold">Video</h4>
									<a
										href={selectedExercise.video_url}
										target="_blank"
										rel="noopener noreferrer"
										className="link link-primary"
									>
										Watch Video
									</a>
								</div>
							)}
						</div>

						<div className="modal-action">
							<button
								className="btn"
								onClick={() => setShowModal(false)}
							>
								Close
							</button>
							<button
								className="btn btn-primary"
								onClick={() => {
									setShowModal(false);
									handleEdit(
										selectedExercise._id ||
											selectedExercise.id
									);
								}}
							>
								Edit Exercise
							</button>
						</div>
					</div>
					<div
						className="modal-backdrop"
						onClick={() => setShowModal(false)}
					></div>
				</div>
			)}
		</>
	);
};

export default ExerciseListComponent;
