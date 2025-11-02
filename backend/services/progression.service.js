// services/progression.service.js
import SessionLog from "../models/sessionLog.model.js";
import Exercise from "../models/exercise.model.js";
import UserPlan from "../models/userPlan.model.js";

/**
 * Read recent N matching entries (most recent first) for a user+exercise
 */
export async function getRecentEntriesForExercise(
	userId,
	exerciseId,
	limit = 3
) {
	const logs = await SessionLog.find({ userId })
		.sort({ date: -1 })
		.limit(30)
		.lean();
	const entries = [];
	for (const log of logs) {
		for (const e of log.entries) {
			if (String(e.exerciseId) === String(exerciseId)) {
				entries.push({
					date: log.date,
					status: e.status,
					rpe: e.rpe || null,
					actual: e.actual || {},
				});
				if (entries.length >= limit) break;
			}
		}
		if (entries.length >= limit) break;
	}
	return entries;
}

/**
 * applyMicroProgression: given exerciseDoc and optional planned, returns a new planned object
 */
function applyMicroProgression(exerciseDoc, planned = null) {
	const prog = exerciseDoc?.progression || {};
	const method = prog.method || "reps";
	const micro = Number(prog.micro_step || 1);
	const base = {
		...(exerciseDoc?.default_prescription || {}),
		...(planned || {}),
	};

	const safeIncreaseReps = () => {
		if (typeof base.reps === "number")
			return Math.max(1, base.reps + micro);
		return base.reps;
	};

	if (method === "load" && typeof base.load_kg === "number") {
		const pct = prog.load_step_pct ?? 2.5;
		const newKg = Math.round(base.load_kg * (1 + pct / 100) * 10) / 10;
		return { ...base, load_kg: newKg };
	}

	// default -> reps
	if (method === "reps" || method === "reps_then_load" || !method) {
		return { ...base, reps: safeIncreaseReps() };
	}

	if (method === "time") {
		const step = micro * 60; // micro is minutes if admin set micro in minutes; interpret as minutes
		const newTime = (base.time_seconds || 0) + step;
		return { ...base, time_seconds: newTime };
	}

	// fallback: return base unchanged
	return base;
}

/**
 * evaluateProgression
 * - accepts either exerciseDoc or null (exerciseDoc recommended)
 * - recentEntries: array of {status, rpe, actual}
 * Returns decision object: { action: 'increase'|'decrease'|'swapEasier'|'same', newPlanned?: {...} }
 */
export function evaluateProgression(exerciseDoc, recentEntries) {
	const N = 3;
	const entries = (recentEntries || []).slice(0, N);
	if (!exerciseDoc) return { action: "same" };
	if (entries.length === 0) return { action: "same" };

	const done = entries.filter((e) => e.status === "done").length;
	const skipped = entries.filter((e) => e.status === "skipped").length;
	const difficult = entries.filter((e) => e.status === "difficult").length;
	const avgRpe =
		entries.reduce((s, e) => s + (e.rpe || 0), 0) / entries.length;

	const successRate = done / entries.length;
	const skipRate = skipped / entries.length;
	const difficultRate = difficult / entries.length;

	// progression rules (tunable)
	const TARGET_SUCCESS = 0.66;
	if (
		successRate >= TARGET_SUCCESS &&
		(avgRpe === 0 || avgRpe <= 6) &&
		skipRate <= 0.2
	) {
		const newPlanned = applyMicroProgression(exerciseDoc);
		return { action: "increase", newPlanned };
	}

	if (skipRate >= 0.33 || avgRpe >= 8 || difficultRate >= 0.5) {
		// try swap to alternative if present
		if (exerciseDoc.alternatives && exerciseDoc.alternatives.length) {
			return {
				action: "swapEasier",
				toExerciseId: exerciseDoc.alternatives[0],
			};
		}
		// else reduce volume
		const base = exerciseDoc.default_prescription || {};
		const newSets = Math.max(1, (base.sets || 3) - 1);
		const newReps = base.reps
			? Math.max(1, Math.round(base.reps * 0.9))
			: base.reps;
		return {
			action: "decrease",
			newPlanned: { ...base, sets: newSets, reps: newReps },
		};
	}

	return { action: "same" };
}

/**
 * applyDecisionToUserPlan: pushes an override into UserPlan
 * - userId, exerciseId, decision (from evaluateProgression), effectiveDate (YYYY-MM-DD)
 */
export async function applyDecisionToUserPlan(
	userId,
	exerciseId,
	decision,
	effectiveDate
) {
	if (!userId || !exerciseId || !decision) return null;
	const up = await UserPlan.findOne({ userId });
	if (!up) {
		console.warn("No UserPlan for user", userId);
		return null;
	}

	const ov = { date: effectiveDate, exerciseId, action: null, payload: null };
	if (decision.action === "increase" || decision.action === "decrease") {
		ov.action = "adjustVolume";
		ov.payload = { planned: decision.newPlanned };
	} else if (
		decision.action === "swapEasier" ||
		decision.action === "swapAdvanced"
	) {
		ov.action = "replace";
		ov.payload = { to: decision.toExerciseId || null };
	} else {
		return null;
	}

	up.overrides = up.overrides || [];
	up.overrides.push(ov);
	await up.save();
	return ov;
}
