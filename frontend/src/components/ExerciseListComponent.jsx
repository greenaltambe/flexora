import { useState } from "react";
import { useNavigate } from "react-router-dom";
import exerciseStore from "../store/exercise/exerciseStore";
import toast from "react-hot-toast";
import { Eye, Edit, Trash2 } from "lucide-react";

const ExerciseListComponent = ({ exercises, onRefresh }) => {
	const { deleteExercise } = exerciseStore();
	const navigate = useNavigate();
	const [isDeleting, setIsDeleting] = useState({});

	const handleViewDetails = (id) => {
		navigate(`/exercises/${id}`);
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
								className="hover:bg-base-200 cursor-pointer"
								onClick={() =>
									handleViewDetails(
										exercise._id || exercise.id
									)
								}
							>
								<td className="max-w-xs">
									<div
										className="font-medium text-primary hover:text-secondary truncate"
										title={exercise.name}
									>
										{exercise.name}
									</div>
								</td>
								<td>
									<span className="badge badge-ghost badge-sm">
										{exercise.type}
									</span>
								</td>
								<td className="max-w-xs">
									<div
										className="truncate text-sm"
										title={
											Array.isArray(
												exercise.primary_muscles
											)
												? exercise.primary_muscles.join(
														", "
												  )
												: exercise.primary_muscles
										}
									>
										{Array.isArray(exercise.primary_muscles)
											? exercise.primary_muscles.join(
													", "
											  )
											: exercise.primary_muscles}
									</div>
								</td>
								<td className="max-w-xs">
									<div
										className="truncate text-sm"
										title={
											Array.isArray(exercise.equipment)
												? exercise.equipment.join(", ")
												: exercise.equipment
										}
									>
										{Array.isArray(exercise.equipment)
											? exercise.equipment.join(", ")
											: exercise.equipment}
									</div>
								</td>
								<td>
									<span
										className={`badge badge-sm ${
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
								</td>
								<td>
									<div
										className="flex gap-2"
										onClick={(e) => e.stopPropagation()}
									>
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
		</>
	);
};

export default ExerciseListComponent;
