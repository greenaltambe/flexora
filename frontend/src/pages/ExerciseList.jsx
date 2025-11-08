import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const ExerciseList = () => {
	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold mb-2">Exercises</h1>
					<p className="text-base-content/70">
						Browse and search exercise library
					</p>
				</div>
			</div>

			<div className="card bg-base-100 shadow-lg p-6">
				<p className="text-center text-base-content/70">
					Exercise list coming soon...
				</p>
			</div>
		</div>
	);
};

export default ExerciseList;
