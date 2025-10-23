import { Link } from "react-router-dom";

const CreateExerciseButton = () => {
	return (
		<Link to="/exercises/create" className="btn btn-primary mb-4">
			Create New Exercise
		</Link>
	);
};

export default CreateExerciseButton;
