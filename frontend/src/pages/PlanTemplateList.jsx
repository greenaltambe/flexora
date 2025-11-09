import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePlanTemplateStore } from "../store/planTemplate/planTemplateStore";
import { Filter, Calendar, TrendingUp, Target, Dumbbell } from "lucide-react";

const PlanTemplateList = () => {
	const { templates, isLoading, getPlanTemplates } = usePlanTemplateStore();
	const [goalFilter, setGoalFilter] = useState("");
	const [levelFilter, setLevelFilter] = useState("");

	useEffect(() => {
		fetchTemplates();
	}, [goalFilter, levelFilter]);

	const fetchTemplates = async () => {
		const filters = { published: true };
		if (goalFilter) filters.goal = goalFilter;
		if (levelFilter) filters.level = levelFilter;
		await getPlanTemplates(filters);
	};

	const getLevelColor = (level) => {
		const colors = {
			beginner: "badge-success",
			intermediate: "badge-warning",
			advanced: "badge-error",
		};
		return colors[level] || "badge-ghost";
	};

	const getGoalIcon = (goal) => {
		const icons = {
			strength: <Dumbbell className="w-4 h-4" />,
			hypertrophy: <TrendingUp className="w-4 h-4" />,
			fat_loss: <Target className="w-4 h-4" />,
			endurance: <Calendar className="w-4 h-4" />,
		};
		return icons[goal] || <Target className="w-4 h-4" />;
	};

	if (isLoading && templates.length === 0) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-center items-center min-h-[400px]">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold mb-2">Plan Templates</h1>
					<p className="text-base-content/70">
						Browse and select workout plan templates
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="card bg-base-100 shadow-lg mb-6">
				<div className="card-body">
					<div className="flex items-center gap-2 mb-4">
						<Filter className="w-5 h-5" />
						<h3 className="font-semibold">Filters</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="form-control">
							<label className="label">
								<span className="label-text">Goal</span>
							</label>
							<select
								className="select select-bordered"
								value={goalFilter}
								onChange={(e) => setGoalFilter(e.target.value)}
							>
								<option value="">All Goals</option>
								<option value="strength">Strength</option>
								<option value="hypertrophy">Hypertrophy</option>
								<option value="fat_loss">Fat Loss</option>
								<option value="endurance">Endurance</option>
							</select>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Level</span>
							</label>
							<select
								className="select select-bordered"
								value={levelFilter}
								onChange={(e) => setLevelFilter(e.target.value)}
							>
								<option value="">All Levels</option>
								<option value="beginner">Beginner</option>
								<option value="intermediate">
									Intermediate
								</option>
								<option value="advanced">Advanced</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Templates Grid */}
			{templates.length === 0 ? (
				<div className="card bg-base-100 shadow-lg p-12">
					<div className="text-center">
						<Target className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
						<p className="text-lg text-base-content/70">
							No templates found matching your filters.
						</p>
						<p className="text-sm text-base-content/50 mt-2">
							Try adjusting your filters or check back later.
						</p>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{templates.map((template) => (
						<Link
							key={template._id}
							to={`/plans/${template._id}`}
							className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
						>
							<div className="card-body">
								<h2 className="card-title text-lg">
									{template.title}
								</h2>

								<div className="flex flex-wrap gap-2 my-3">
									<div
										className={`badge ${getLevelColor(
											template.level
										)} badge-sm capitalize`}
									>
										{template.level}
									</div>
									{template.goal && (
										<div className="badge badge-outline badge-sm capitalize flex items-center gap-1">
											{getGoalIcon(template.goal)}
											{template.goal.replace("_", " ")}
										</div>
									)}
								</div>

								<div className="flex items-center gap-4 text-sm text-base-content/70">
									<div className="flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										<span>{template.weeks} weeks</span>
									</div>
									<div className="flex items-center gap-1">
										<Dumbbell className="w-4 h-4" />
										<span>
											{template.daysPerWeek} days/week
										</span>
									</div>
								</div>

								<div className="card-actions justify-end mt-4">
									<button className="btn btn-primary btn-sm">
										View Details
									</button>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default PlanTemplateList;
