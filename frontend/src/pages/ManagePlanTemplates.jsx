import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const ManagePlanTemplates = () => {
	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold mb-2">Manage Plan Templates</h1>
					<p className="text-base-content/70">
						Create and manage workout plan templates
					</p>
				</div>
				<Link
					to="/admin/plan-templates/create"
					className="btn btn-primary gap-2"
				>
					<Plus className="w-5 h-5" />
					Create Template
				</Link>
			</div>

			<div className="card bg-base-100 shadow-lg p-6">
				<p className="text-center text-base-content/70">
					Template management coming soon...
				</p>
			</div>
		</div>
	);
};

export default ManagePlanTemplates;
