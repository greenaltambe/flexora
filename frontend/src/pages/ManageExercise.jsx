import ManageExerciseMenu from "../components/ManageExerciseMenu";
import { Cog } from "lucide-react";
import { useAuthStore } from "../store/auth/authStore";

const ManageExercise = () => {
	const { user } = useAuthStore();
	return (
		<div className="min-h-screen bg-base-200 p-4">
			<div className="container mx-auto">
				<h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
					<Cog className="w-8 h-8 text-primary" /> Manage Exercise
				</h1>
				<p className="text-base-content/70 mb-8">
					Welcome, {user?.firstName}. Manage Flexora here.
				</p>
				<div className="flex justify-center">
					<ManageExerciseMenu />
				</div>
			</div>
		</div>
	);
};

export default ManageExercise;
