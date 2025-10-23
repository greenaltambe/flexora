import { Link } from "react-router-dom";
import { Plus, ChevronDown, FileText } from "lucide-react";

const CreateExerciseButton = () => {
	return (
		<div className="dropdown dropdown-end">
			<label tabIndex={0} className="btn btn-primary">
				<Plus className="w-4 h-4 mr-2" />
				Create New Exercise
				<ChevronDown className="w-4 h-4 ml-2" />
			</label>
			<ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow-lg w-56 z-50 mt-2">
				<li>
					<Link to="/admin/exercises/create" className="flex items-center gap-2">
						<Plus className="w-4 h-4" />
						Add One Exercise
					</Link>
				</li>
				<li>
					<Link to="/admin/exercises/import-csv" className="flex items-center gap-2">
						<FileText className="w-4 h-4" />
						Import from CSV
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default CreateExerciseButton;
