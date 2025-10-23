import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const CreateExerciseButton = () => {
	return (
		<Link to="/admin/exercises/create" className="btn btn-primary">
			<Plus className="w-4 h-4 mr-2" />
			Create New Exercise
		</Link>
	);
};

export default CreateExerciseButton;
