import {
	updateStreak,
	checkStreakStatus,
	addFreezeDay,
	getStreakSummary,
	acknowledgeMilestone,
	calculateWeeklyConsistency,
	MILESTONE_DEFINITIONS,
} from "../services/streak.service.js";
import Streak from "../models/streak.model.js";

const getStreak = async (req, res) => {
	try {
		const userId = req.user.id;
		const streak = await Streak.findOne({ userId });

		if (!streak) {
			return res.json({
				currentStreak: 0,
				longestStreak: 0,
				totalWorkouts: 0,
				lastWorkoutDate: null,
			});
		}

		return res.json({ streak });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const getStreakSummaryController = async (req, res) => {
	try {
		const userId = req.user.id;
		const summary = await getStreakSummary(userId);
		return res.json({ summary });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const addFreezeDayController = async (req, res) => {
	try {
		const userId = req.user.id;
		const { date, reason } = req.body;

		if (!date) {
			return res.status(400).json({ message: "Date is required" });
		}

		const streak = await addFreezeDay(userId, date, reason);
		return res.json({
			message: "Freeze day added successfully",
			streak,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const getMilestones = async (req, res) => {
	try {
		const userId = req.user.id;
		const streak = await Streak.findOne({ userId });

		if (!streak) {
			return res.json({ milestones: [], definitions: MILESTONE_DEFINITIONS });
		}

		return res.json({
			milestones: streak.milestones,
			definitions: MILESTONE_DEFINITIONS,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const acknowledgeMilestoneController = async (req, res) => {
	try {
		const userId = req.user.id;
		const { type } = req.params;

		const streak = await acknowledgeMilestone(userId, type);
		return res.json({
			message: "Milestone acknowledged",
			streak,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const checkStreakStatusController = async (req, res) => {
	try {
		const userId = req.user.id;
		const status = await checkStreakStatus(userId);
		return res.json({ status });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const getWeeklyConsistency = async (req, res) => {
	try {
		const userId = req.user.id;
		const consistency = await calculateWeeklyConsistency(userId);
		return res.json({ consistency });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

export {
	getStreak,
	getStreakSummaryController,
	addFreezeDayController,
	getMilestones,
	acknowledgeMilestoneController,
	checkStreakStatusController,
	getWeeklyConsistency,
};
