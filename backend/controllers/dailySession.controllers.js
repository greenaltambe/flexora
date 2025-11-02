import DailySession from "../models/dailySession.model.js";
import UserPlan from "../models/userPlan.model.js";
import PlanTemplate from "../models/planTemplate.model.js";
import Exercise from "../models/exercise.model.js";
import mongoose from "mongoose";

function todayDateString() {
	const d = new Date();
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

/**
 * Generate DailySession for user/date if missing.
 * Steps:
 * - load UserPlan, PlanTemplate, dayTemplate
 * - for each dayTemplate exercise: load Exercise doc, pick planned = template.planned || exercise.default_prescription
 * - apply overrides from UserPlan that have date === targetDate (replace/adjustVolume)
 * - save DailySession and return it
 */
const generateDailySessionForUser = async (userId, dateString) => {
	if (!dateString) dateString = todayDateString();
	// if exists return existing
	const existing = await DailySession.findOne({
		userId,
		date: dateString,
	}).lean();
	if (existing) return existing;

	const up = await UserPlan.findOne({ userId });
	if (!up) throw new Error("UserPlan not found");

	const tpl = await PlanTemplate.findById(up.templateId).lean();
	if (!tpl) throw new Error("PlanTemplate not found");

	// determine day index (simple round-robin using currentDayIndex)
	const dayIndex = up.currentDayIndex || 0;
	const dayTemplate = (tpl.dayTemplates && tpl.dayTemplates[dayIndex]) || {
		exercises: [],
	};

	// build session exercises
	const exercises = [];
	for (const item of dayTemplate.exercises) {
		const exDoc = await Exercise.findById(item.exerciseId).lean();
		if (!exDoc) continue;
		// planned = item.planned overrides OR exercise.default_prescription
		const planned = {
			...(exDoc.default_prescription || {}),
			...(item.planned || {}),
		};

		// convert time_minutes if present in planned (backwards compatibility)
		if (planned.time_minutes && !planned.time_seconds) {
			planned.time_seconds = planned.time_minutes * 60;
			delete planned.time_minutes;
		}

		exercises.push({
			exerciseId: exDoc._id,
			planned,
			variant: item.variant || "base",
			cue: item.cue || "",
		});
	}

	// apply overrides from userPlan for this date
	const overridesForDate = (up.overrides || []).filter(
		(o) => o.date === dateString
	);
	for (const ov of overridesForDate) {
		const idx = exercises.findIndex(
			(e) => String(e.exerciseId) === String(ov.exerciseId)
		);
		if (idx === -1) continue;
		if (ov.action === "replace" && ov.payload && ov.payload.to) {
			// replace id and read the new exercise prescription baseline
			const newEx = await Exercise.findById(ov.payload.to).lean();
			if (!newEx) continue;
			const planned = { ...(newEx.default_prescription || {}) };
			exercises[idx].exerciseId = newEx._id;
			exercises[idx].planned = planned;
			exercises[idx].variant = "easier";
		} else if (
			ov.action === "adjustVolume" &&
			ov.payload &&
			ov.payload.planned
		) {
			// merge planned override (supports time_minutes conversion)
			const p = {
				...(exercises[idx].planned || {}),
				...(ov.payload.planned || {}),
			};
			if (p.time_minutes && !p.time_seconds) {
				p.time_seconds = p.time_minutes * 60;
				delete p.time_minutes;
			}
			exercises[idx].planned = p;
		}
	}

	// create DailySession snapshot
	const sessionDoc = {
		userPlanId: up._id,
		userId,
		date: dateString,
		exercises,
	};
	const saved = await DailySession.create(sessionDoc);
	return saved.toObject();
};

const getTodaySession = async (req, res) => {
	try {
		const userId = req.user.id;
		const dateString = todayDateString();
		const session = await generateDailySessionForUser(userId, dateString);
		return res.json({ session });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const getSessionByDate = async (req, res) => {
	try {
		const userId = req.user.id;
		const { date } = req.params; // expect YYYY-MM-DD
		if (!date) return res.status(400).json({ message: "date required" });
		const session = await generateDailySessionForUser(userId, date);
		return res.json({ session });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

export { getTodaySession, getSessionByDate, generateDailySessionForUser };
