// controllers/sessionLog.controller.js
import SessionLog from "../models/sessionLog.model.js";
import DailySession from "../models/dailySession.model.js";
import Exercise from "../models/exercise.model.js";
import {
	getRecentEntriesForExercise,
	evaluateProgression,
	applyDecisionToUserPlan,
} from "../services/progression.service.js";

/**
 * Accepts: POST /api/session/:date/log
 * body: { entries: [ { exerciseId, status, actual: { sets,reps,load_kg,time_seconds }, rpe, notes } ] }
 */
const submitSessionLog = async (req, res) => {
	try {
		const userId = req.user.id;
		const { date } = req.params;
		const entries = Array.isArray(req.body.entries) ? req.body.entries : [];
		if (!date) return res.status(400).json({ message: "date required" });
		if (!entries.length)
			return res.status(400).json({ message: "entries required" });

		// normalize each actual if client supplied time_minutes convert to seconds
		for (const e of entries) {
			if (e.actual && e.actual.time_minutes && !e.actual.time_seconds) {
				e.actual.time_seconds = Number(e.actual.time_minutes) * 60;
				delete e.actual.time_minutes;
			}
		}

		// upsert SessionLog (unique per user+date)
		const filter = { userId, date };
		const update = { userId, date, entries };
		const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
		const savedLog = await SessionLog.findOneAndUpdate(
			filter,
			update,
			opts
		);

		// run progression engine for each entry (async but we wait to show demo results)
		for (const e of entries) {
			try {
				// get recent entries for that exercise
				const recent = await getRecentEntriesForExercise(
					userId,
					e.exerciseId,
					3
				);
				const exDoc = e.exerciseId
					? await Exercise.findById(e.exerciseId).lean()
					: null;
				const exDecision = evaluateProgression(exDoc, recent);
				// apply decision if action not 'same'
				if (
					exDecision &&
					exDecision.action &&
					exDecision.action !== "same"
				) {
					// compute nextDate: simple next day — in production calculate next scheduled date
					const nextDateObj = new Date(date);
					nextDateObj.setDate(nextDateObj.getDate() + 1);
					const yyyy = nextDateObj.getFullYear();
					const mm = String(nextDateObj.getMonth() + 1).padStart(
						2,
						"0"
					);
					const dd = String(nextDateObj.getDate()).padStart(2, "0");
					const nextDate = `${yyyy}-${mm}-${dd}`;

					await applyDecisionToUserPlan(
						userId,
						e.exerciseId,
						exDecision,
						nextDate
					);
				}
			} catch (innerErr) {
				console.error(
					"progression error for entry",
					e.exerciseId,
					innerErr
				);
			}
		}

		return res.json({ message: "Logged", savedLog });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

export { submitSessionLog };
