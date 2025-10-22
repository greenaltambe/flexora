import ManageExerciseMenu from "../components/ManageExerciseMenu";
import { SlidersHorizontal } from "lucide-react";

const ManageExercise = () => {
	return (
		<div className="card bg-base-100 w-full shadow-lg">
			<div className="card-body">
				<h2 className="card-title flex items-center gap-2">
					<SlidersHorizontal className="w-5 h-5" /> Manage Exercise
				</h2>
				<div className="flex justify-center">
					<ManageExerciseMenu />
				</div>
			</div>
		</div>
	);
};

export default ManageExercise;
