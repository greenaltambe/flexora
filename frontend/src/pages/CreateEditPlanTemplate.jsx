import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CreateEditPlanTemplate = () => {
	const { id } = useParams();
	const isEdit = !!id;

	return (
		<div className="max-w-4xl mx-auto">
			<Link
				to="/admin/plan-templates"
				className="btn btn-ghost btn-sm mb-4 gap-2"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Manage Templates
			</Link>

			<div className="card bg-base-100 shadow-lg p-6">
				<h1 className="text-3xl font-bold mb-4">
					{isEdit ? "Edit Plan Template" : "Create Plan Template"}
				</h1>
				<p className="text-base-content/70">
					{isEdit ? `Editing template ID: ${id}` : "Create a new plan template"}
				</p>
				<p className="text-base-content/70 mt-2">
					Form coming soon...
				</p>
			</div>
		</div>
	);
};

export default CreateEditPlanTemplate;
