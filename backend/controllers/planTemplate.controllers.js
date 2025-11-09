import PlanTemplate from "../models/planTemplate.model.js";
import mongoose from "mongoose";

const createPlanTemplate = async (req, res) => {
	try {
		const payload = req.body;
		if (!payload.title)
			return res.status(400).json({ message: "title required" });
		const tpl = new PlanTemplate(payload);
		await tpl.save();
		return res.status(201).json({ planTemplate: tpl });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const getPlanTemplates = async (req, res) => {
	try {
		const q = {};
		if (req.query.goal) q.goal = req.query.goal;
		if (req.query.level) q.level = req.query.level;
		if (req.query.published !== undefined)
			q.published = req.query.published === "true";
		if (req.query.title) {
			q.title = { $regex: req.query.title, $options: "i" }; // Case-insensitive search
		}
		const templates = await PlanTemplate.find(q).select(
			"title goal level weeks daysPerWeek published"
		);
		return res.json({ templates });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const getPlanTemplateById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(400).json({ message: "Invalid id" });
		const tpl = await PlanTemplate.findById(id);
		if (!tpl) return res.status(404).json({ message: "Not found" });
		return res.json({ planTemplate: tpl });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const updatePlanTemplate = async (req, res) => {
	try {
		const { id } = req.params;
		const tpl = await PlanTemplate.findById(id);
		if (!tpl) return res.status(404).json({ message: "Not found" });
		Object.assign(tpl, req.body);
		await tpl.save();
		return res.json({ planTemplate: tpl });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const deletePlanTemplate = async (req, res) => {
	try {
		const { id } = req.params;
		await PlanTemplate.findByIdAndDelete(id);
		return res.json({ message: "Deleted" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

export {
	createPlanTemplate,
	getPlanTemplates,
	getPlanTemplateById,
	updatePlanTemplate,
	deletePlanTemplate,
};
