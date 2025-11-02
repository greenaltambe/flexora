import Recipe from "../models/recipe.model.js";
import dotenv from "dotenv";

dotenv.config();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || null;
const SPOONACULAR_API_URL_RAW =
	process.env.SPOONACULAR_API_URL || "https://api.spoonacular.com/recipes";
const SPOONACULAR_API_ROOT = SPOONACULAR_API_URL_RAW.replace(
	/\/complexSearch\/?$/i,
	""
);

const cache = new Map();

function getCache(key) {
	const rec = cache.get(key);
	if (!rec) return null;
	if (rec.expires < Date.now()) {
		cache.delete(key);
		return null;
	}
	return rec.value;
}

function setCache(key, value, ttlMs) {
	cache.set(key, { value, expires: Date.now() + ttlMs });
}

async function fetchWithRetry(url, options = {}) {
	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(
				`HTTP error! status: ${response.status} for ${url}`
			);
		}
		return response;
	} catch (error) {
		await new Promise((resolve) => setTimeout(resolve, 500)); // retry once after 500ms
		return fetch(url, options);
	}
}

function normalizeRecipeFromSpoonacular(raw) {
	return {
		externalId: String(raw.id),
		source: "spoonacular",
		title: raw.title || "Recipe",
		prep_minutes: raw.readyInMinutes || null,
		total_calories:
			raw.nutrition?.nutrients?.find((n) => n.name === "Calories")
				?.amount || null,
		protein_g:
			raw.nutrition?.nutrients?.find((n) => n.name === "Protein")
				?.amount || null,
		carbs_g:
			raw.nutrition?.nutrients?.find((n) => n.name === "Carbohydrates")
				?.amount || null,
		fat_g:
			raw.nutrition?.nutrients?.find((n) => n.name === "Fat")?.amount ||
			null,
		image: raw.image || null,
		url: raw.sourceUrl || null,
		nutrition: raw.nutrition || {},
	};
}

export async function searchRecipes(params = {}) {
	const key = "search:" + JSON.stringify(params || {});
	const cached = getCache(key);
	if (cached) return cached;
	if (!SPOONACULAR_API_KEY) {
		console.warn(
			"Spoonacular API key not configured; searchRecipes will return empty results."
		);
		return [];
	}

	try {
		const url = `${SPOONACULAR_API_ROOT}/complexSearch`;
		const queryParams = {
			apiKey: SPOONACULAR_API_KEY,
			number: params.limit || 8,
			addRecipeInformation: true,
			maxReadyTime: params.maxPrepMinutes,
			minCalories: params.calMin,
			maxCalories: params.calMax,
			intolerances: Array.isArray(params.intolerances)
				? params.intolerances.join(",")
				: undefined,
			diet: params.diet || undefined,
		};

		const qs = Object.entries(queryParams)
			.filter(([k, v]) => v !== undefined && v !== null && v !== "")
			.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
			.join("&");
		const fullUrl = `${url}?${qs}`;
		const response = await fetchWithRetry(fullUrl, { method: "GET" });
		const data = await response.json();
		const recipes = (data.results || []).map(
			normalizeRecipeFromSpoonacular
		);
		setCache(key, recipes, 2 * 60 * 60 * 1000); // cache for 2 hours
		return recipes;
	} catch (error) {
		console.error("Error searching recipes:", error);
		return [];
	}
}

export async function getRecipeByExternalId(source, externalId) {
	const key = `detail:${source}:${externalId}`;
	const cached = getCache(key);
	if (cached) return cached;
	if (!SPOONACULAR_API_KEY) {
		console.warn(
			"Spoonacular API key not configured; getRecipeByExternalId will return null."
		);
		return null;
	}

	try {
		const url = `${SPOONACULAR_API_ROOT}/${externalId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;
		const response = await fetchWithRetry(url, { method: "GET" });
		const data = await response.json();
		const recipe = normalizeRecipeFromSpoonacular(data);
		setCache(key, recipe, 6 * 60 * 60 * 1000); // cache for 6 hours
		return recipe;
	} catch (error) {
		console.error("Error fetching recipe details:", error);
		return null;
	}
}

export async function cacheRecipeToDB(normalized) {
	if (!normalized) return null;
	try {
		const existing = await Recipe.findOne({
			externalId: normalized.externalId,
			source: normalized.source,
		});
		if (existing) return existing;
		const doc = new Recipe({
			externalId: normalized.externalId,
			source: normalized.source,
			title: normalized.title,
			prep_minutes: normalized.prep_minutes,
			total_calories: normalized.total_calories,
			protein_g: normalized.protein_g,
			carbs_g: normalized.carbs_g,
			fat_g: normalized.fat_g,
			nutrition: normalized.nutrition,
			image: normalized.image,
			url: normalized.url,
		});
		await doc.save();
		return doc;
	} catch (err) {
		console.error("cacheRecipeToDB error:", err);
		return null;
	}
}
