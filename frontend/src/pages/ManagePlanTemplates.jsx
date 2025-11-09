import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash, Search, CheckCircle, Clock } from "lucide-react";
import { usePlanTemplateStore } from "../store/planTemplate/planTemplateStore";
import PageContainer from "../components/PageContainer";
import toast from "react-hot-toast";

const ManagePlanTemplates = () => {
const navigate = useNavigate();
const { templates, isLoading, getPlanTemplates, deletePlanTemplate } =
usePlanTemplateStore();
const [searchQuery, setSearchQuery] = useState("");
const [goalFilter, setGoalFilter] = useState("");
const [levelFilter, setLevelFilter] = useState("");
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [templateToDelete, setTemplateToDelete] = useState(null);

useEffect(() => {
fetchTemplates();
}, [searchQuery, goalFilter, levelFilter]);

const fetchTemplates = async () => {
const filters = {};
if (searchQuery) filters.title = searchQuery;
if (goalFilter) filters.goal = goalFilter;
if (levelFilter) filters.level = levelFilter;
await getPlanTemplates(filters);
};

const handleDelete = async () => {
if (!templateToDelete) return;
const result = await deletePlanTemplate(templateToDelete);
if (result.success) {
toast.success("Template deleted successfully");
setShowDeleteModal(false);
setTemplateToDelete(null);
} else {
toast.error(result.message || "Failed to delete template");
}
};

const confirmDelete = (id) => {
setTemplateToDelete(id);
setShowDeleteModal(true);
};

if (isLoading && templates.length === 0) {
return (
<PageContainer>
<div className="flex justify-center items-center min-h-[400px]">
<span className="loading loading-spinner loading-lg"></span>
</div>
</PageContainer>
);
}

return (
<PageContainer>
<div className="flex flex-col gap-6">
{/* Header */}
<div className="flex items-center justify-between">
<div>
<h1 className="text-3xl font-bold">Manage Plan Templates</h1>
<p className="text-base-content/70">
Create and organize workout plan templates
</p>
</div>
<Link
to="/admin/plan-templates/create"
className="btn btn-primary gap-2"
>
<Plus className="w-4 h-4" />
Create Template
</Link>
</div>

{/* Search and Filters */}
<div className="card bg-base-100 shadow-lg">
<div className="card-body">
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
<div className="form-control lg:col-span-1">
<label className="label">
<span className="label-text">Search</span>
</label>
<div className="relative">
<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
<input
type="text"
placeholder="Search by title..."
className="input input-bordered w-full pl-10"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
/>
</div>
</div>

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
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>
</select>
</div>
</div>
</div>
</div>

{/* Templates Table */}
<div className="card bg-base-100 shadow-lg">
<div className="card-body p-0">
<div className="overflow-x-auto">
<table className="table table-zebra">
<thead>
<tr>
<th>Title</th>
<th>Goal</th>
<th>Level</th>
<th>Duration</th>
<th>Days/Week</th>
<th>Status</th>
<th className="text-right">Actions</th>
</tr>
</thead>
<tbody>
{templates.length === 0 ? (
<tr>
<td colSpan="7" className="text-center py-8">
<p className="text-base-content/70">
No templates found. Create your first template!
</p>
</td>
</tr>
) : (
templates.map((template) => (
<tr key={template._id}>
<td>
<div className="font-medium">{template.title}</div>
</td>
<td>
<div className="badge badge-ghost badge-sm capitalize">
{template.goal || "General"}
</div>
</td>
<td>
<div className="badge badge-outline badge-sm capitalize">
{template.level}
</div>
</td>
<td>{template.weeks} weeks</td>
<td>{template.daysPerWeek} days</td>
<td>
{template.published ? (
<div className="badge badge-success badge-sm gap-1">
<CheckCircle className="w-3 h-3" />
Published
</div>
) : (
<div className="badge badge-warning badge-sm gap-1">
<Clock className="w-3 h-3" />
Draft
</div>
)}
</td>
<td>
<div className="flex justify-end gap-2">
<button
onClick={() =>
navigate(`/plans/${template._id}`)
}
className="btn btn-ghost btn-sm"
title="View"
>
View
</button>
<button
onClick={() =>
navigate(
`/admin/plan-templates/edit/${template._id}`
)
}
className="btn btn-ghost btn-sm"
title="Edit"
>
<Edit className="w-4 h-4" />
</button>
<button
onClick={() => confirmDelete(template._id)}
className="btn btn-ghost btn-sm text-error"
title="Delete"
>
<Trash className="w-4 h-4" />
</button>
</div>
</td>
</tr>
))
)}
</tbody>
</table>
</div>
</div>
</div>
</div>

{/* Delete Confirmation Modal */}
{showDeleteModal && (
<div className="modal modal-open">
<div className="modal-box">
<h3 className="font-bold text-lg">Confirm Deletion</h3>
<p className="py-4">
Are you sure you want to delete this template? This action cannot
be undone.
</p>
<div className="modal-action">
<button
className="btn btn-ghost"
onClick={() => {
setShowDeleteModal(false);
setTemplateToDelete(null);
}}
>
Cancel
</button>
<button className="btn btn-error" onClick={handleDelete}>
Delete
</button>
</div>
</div>
</div>
)}
</PageContainer>
);
};

export default ManagePlanTemplates;
