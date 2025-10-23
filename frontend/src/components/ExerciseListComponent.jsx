import { Link } from "react-router-dom";

const ExerciseListComponent = ({ exercises }) => {
	return (
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
						<tr key={exercise._id}>
							<td>{exercise.name}</td>
							<td>{exercise.type}</td>
							<td>{exercise.primary_muscles.join(", ")}</td>
							<td>{exercise.equipment.join(", ")}</td>
							<td>{exercise.difficulty}</td>
							<td>
								<Link
									to={`/exercises/edit/${exercise._id}`}
									className="btn btn-sm btn-primary mr-2"
								>
									Edit
								</Link>
								<button className="btn btn-sm btn-error">
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ExerciseListComponent;
