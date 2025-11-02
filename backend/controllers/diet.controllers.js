import {
	getDietRecommendationForUser,
	generateDailySessionForUser,
} from "../services/dietGenerator.service.js";
import DailyMealSession from "../models/dailyMealSession.model.js";
import MealLog from "../models/mealLog.model.js";
import { searchRecipes } from "../services/recipeConnector.service.js";

// GET Diet Recommendation
// @desc Get diet recommendation for user
// @route GET /api/diet/recommendation
// @access Private
export async function getRecommendation(req, res) {
	try {
		const userId = req.user.id;
		const date = req.query.date || null;
		const meals_per_day = req.query.meals_per_day
			? Number(req.query.meals_per_day)
			: null;
		const rec = await getDietRecommendationForUser(
			userId,
			date,
			meals_per_day
		);
		return res.json({ success: true, data: rec });
	} catch (err) {
		console.error("getRecommendation:", err);
		return res.status(500).json({ success: false, message: err.message });
	}
}

// SAVE Daily Meal Session
// @desc Save daily meal session for user
// @route POST /api/diet/session/:date
// @access Private
export async function saveDailySession(req, res) {
	try {
		const userId = req.user.id;
		const date = req.params.date;
		if (!date)
			return res
				.status(400)
				.json({ success: false, message: "date required" });
		const meals = Array.isArray(req.body.meals) ? req.body.meals : [];
		// snapshot create or replace
		const doc = { userId, date, meals, generatedBy: "user_saved" };
		// upsert behaviour: findOneAndUpdate with upsert
		const saved = await DailyMealSession.findOneAndUpdate(
			{ userId, date },
			{ $set: doc },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);
		return res.json({ success: true, session: saved });
	} catch (err) {
		console.error("saveDailySession:", err);
		return res.status(500).json({ success: false, message: err.message });
	}
}

// LOG Meals
// @desc Log meals for a date
// @route POST /api/diet/meals/log/:date
// @access Private
export async function logMeals(req, res) {
	try {
		const userId = req.user.id;
		const date = req.params.date;
		if (!date)
			return res
				.status(400)
				.json({ success: false, message: "date required" });
		const entries = Array.isArray(req.body.entries) ? req.body.entries : [];
		if (!entries.length)
			return res
				.status(400)
				.json({ success: false, message: "entries required" });

		// upsert log document
		const filter = { userId, date };
		const update = { userId, date, entries };
		const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
		const saved = await MealLog.findOneAndUpdate(filter, update, opts);

		// TODO: call adaptation engine (simple rules) — can be async

		return res.json({ success: true, savedLog: saved });
	} catch (err) {
		console.error("logMeals:", err);
		return res.status(500).json({ success: false, message: err.message });
	}
}

// RECIPE Search Proxy
// @desc Proxy to recipe search with cal and prep time filters
// @route GET /api/diet/recipes/search
// @access Private
export async function recipeSearchProxy(req, res) {
	try {
		const q = req.query.q || "";
		// map q to cal range or other heuristics; here just search using calorie fallback
		const params = {
			calMin: undefined,
			calMax: undefined,
			limit: 12,
			maxPrepMinutes: req.query.maxPrepMinutes
				? Number(req.query.maxPrepMinutes)
				: undefined,
		};
		if (req.query.cal) {
			const c = Number(req.query.cal);
			params.calMin = Math.round(c * 0.8);
			params.calMax = Math.round(c * 1.2);
		}
		const results = await searchRecipes(params);
		return res.json({ success: true, results });
	} catch (err) {
		console.error("recipeSearchProxy:", err);
		return res.status(500).json({ success: false, message: err.message });
	}
}
