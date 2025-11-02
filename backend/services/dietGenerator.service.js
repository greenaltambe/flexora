import User from "../models/user.model.js";
import UserDietPlan from "../models/userDietPlan.model.js";
import DailyMealSession from "../models/dailyMealSession.model.js";
import { searchRecipes, cacheRecipeToDB } from "./recipeConnector.service.js";
import { deriveTargets, splitIntoSlots } from "../utils/dietUtils.js";
import Recipe from "../models/recipe.model.js";

// scoreRecipe: scores a candidate recipe for a meal slot
// based on calorie match, prep time, and preferences
function scoreRecipe(candidate, slotCalTarget, opts = {}) {
	const cal = candidate.total_calories || candidate.calories || 0;
	const calScore =
		1 - Math.min(1, Math.abs(cal - slotCalTarget) / slotCalTarget);
	let timeScore = 1;
	if (opts.maxPrepMinutes && candidate.prep_minutes) {
		timeScore =
			candidate.prep_minutes <= opts.maxPrepMinutes
				? 1
				: Math.max(
						0,
						1 - (candidate.prep_minutes - opts.maxPrepMinutes) / 60
				  );
	}
	const prefScore = opts.pref
		? opts.pref.every((p) => (candidate.dietLabels || []).includes(p))
			? 1
			: 0.9
		: 1;
	// weights
	const score = 0.6 * calScore + 0.25 * timeScore + 0.15 * prefScore;
	return Math.max(0, score);
}

// getDietRecommendationForUser: main function to get diet recommendation
export async function getDietRecommendationForUser(
	userId,
	date = null,
	mealsPerDay = null
) {
	// date: YYYY-MM-DD string or null (use today if null)
	const user = await User.findById(userId).lean();
	if (!user) throw new Error("User not found");
	const profile = user.profile || {};

	const targets = deriveTargets({ profile });
	const plan = await UserDietPlan.findOne({ userId }).lean();
	const mpd =
		mealsPerDay ||
		(plan && plan.meals_per_day) ||
		profile.days_per_meal ||
		3;
	const slotDefs = splitIntoSlots(targets.calorieTarget, mpd);

	const slotsOut = [];
	for (let i = 0; i < slotDefs.length; i++) {
		const idx = i;
		const slotName =
			["Breakfast", "Lunch", "Dinner", "Snack"][i] || `Meal ${i + 1}`;
		const slotCal = slotDefs[i].calories;
		// search recipes with tolerance ±15%
		const calMin = Math.round(slotCal * 0.85);
		const calMax = Math.round(slotCal * 1.15);
		const searchParams = {
			calMin,
			calMax,
			diet:
				profile.preferences && profile.preferences[0]
					? profile.preferences[0]
					: undefined,
			intolerances: profile.allergies || [],
			maxPrepMinutes: profile.session_length_minutes || 30,
			limit: 8,
		};
		const candidates = await searchRecipes(searchParams);
		// score candidates
		const scored = candidates.map((c) => ({
			recipe: c,
			score: scoreRecipe(c, slotCal, {
				maxPrepMinutes: searchParams.maxPrepMinutes,
				pref: profile.preferences || [],
			}),
		}));
		scored.sort((a, b) => b.score - a.score);
		// cache top 3 into DB (optional)
		const top = [];
		for (let j = 0; j < Math.min(3, scored.length); j++) {
			const norm = scored[j].recipe;
			// persist minimal to local DB (non-blocking)
			try {
				await cacheRecipeToDB(norm);
			} catch (err) {
				/* ignore */
			}
			top.push({ ...norm, score: scored[j].score });
		}

		slotsOut.push({
			slotName,
			targetCalories: slotCal,
			suggestions: top,
		});
	}

	return {
		date: date || new Date().toISOString().slice(0, 10),
		calorieTarget: targets.calorieTarget,
		macroTargets: targets.macroTargets,
		meals_per_day: mpd,
		slots: slotsOut,
	};
}

// generateDailySessionForUser: creates and saves a daily meal session for user
export async function generateDailySessionForUser(
	userId,
	dateString,
	mealsPerDay = null
) {
	const existing = await DailyMealSession.findOne({
		userId,
		date: dateString,
	}).lean();
	if (existing) return existing;

	const rec = await getDietRecommendationForUser(
		userId,
		dateString,
		mealsPerDay
	);
	// Build meals array sequentially so we can await DB lookups
	const meals = [];
	for (const s of rec.slots) {
		let plannedRecipeId = null;
		if (s.suggestions && s.suggestions[0]) {
			try {
				const r = await Recipe.findOne({
					externalId: s.suggestions[0].externalId,
					source: s.suggestions[0].source,
				});
				plannedRecipeId = r ? r._id : null;
			} catch (err) {
				// ignore DB lookup errors and leave plannedRecipeId null
				plannedRecipeId = null;
			}
		}
		meals.push({
			slotName: s.slotName,
			plannedRecipeId,
			plannedCalories: s.targetCalories,
			plannedProtein_g: s.suggestions[0]?.protein_g || null,
			plannedCarbs_g: s.suggestions[0]?.carbs_g || null,
			plannedFat_g: s.suggestions[0]?.fat_g || null,
		});
	}
	const plan = await UserDietPlan.findOne({ userId }).lean();
	const doc = {
		userDietPlanId: plan?._id || null,
		userId,
		date: dateString,
		meals,
		generatedBy: "recommendation",
	};
	const saved = await DailyMealSession.create(doc);
	return saved.toObject();
}
