import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PlanTemplateDetail = () => {
	const { id } = useParams();

	return (
		<div className="max-w-4xl mx-auto">
			<Link to="/plans" className="btn btn-ghost btn-sm mb-4 gap-2">
				<ArrowLeft className="w-4 h-4" />
				Back to Plans
			</Link>

			<div className="card bg-base-100 shadow-lg p-6">
				<h1 className="text-3xl font-bold mb-4">Plan Template Detail</h1>
				<p className="text-base-content/70">
					Template ID: {id}
				</p>
				<p className="text-base-content/70 mt-2">
					Coming soon...
				</p>
			</div>
		</div>
	);
};

export default PlanTemplateDetail;
