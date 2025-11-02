// BMR is Basal Metabolic Rate
// Mifflin-St Jeor Equation
// For men: BMR = 10W + 6.25H - 5A + 5
// For women: BMR = 10W + 6.25H - 5A - 161
// W = weight in kg
// H = height in cm
// A = age in years
export function calcBMR(sex, weight_kg, height_cm, age_years) {
	if (!weight_kg || !height_cm || !age_years) {
		throw new Error(
			"Weight, height, and age are required to calculate BMR."
		);
	}

	const baseBMR = 10 * weight_kg + 6.25 * height_cm - 5 * age_years;

	if (sex === "male") {
		return Math.round(baseBMR + 5);
	} else if (sex === "female") {
		return Math.round(baseBMR - 161);
	} else {
		return Math.round(baseBMR - 78);
	}
}

// TDEE is Total Daily Energy Expenditure
// Activity level multipliers:
// Sedentary (little or no exercise): 1.2
// Lightly active (light exercise/sports 1-3 days/week): 1.375
// Moderately active (moderate exercise/sports 3-5 days/week): 1.55
// Very active (hard exercise/sports 6-7 days a week): 1.725
// Extra active (very hard exercise/sports & physical job or 2x training): 1.9
export function calcTDEE(bmr, activityLevel = "light") {
	const map = {
		sedentary: 1.2,
		light: 1.375,
		moderate: 1.55,
		active: 1.725,
		very_active: 1.9,
	};
	const mult = map[activityLevel] || 1.375;
	return Math.round(bmr * mult);
}

// Derive calorie and macro targets from user profile
export function deriveTargets({ profile }) {
	const baseline = profile?.baseline_metrics || {};
	const bmr = calcBMR(
		baseline.sex,
		baseline.weight_kg,
		baseline.height_cm,
		baseline.age
	);
	const activity = profile.activityLevel || "light";
	const tdee = calcTDEE(bmr, activity);
	const goals = profile.goals || [];
	let calorieTarget = tdee || 2000;
	if (goals.includes("fat_loss"))
		calorieTarget = Math.round(calorieTarget * 0.85);
	if (goals.includes("muscle_gain"))
		calorieTarget = Math.round(calorieTarget * 1.1);

	const protein_g = Math.round((baseline.weight_kg || 70) * 1.8); // default 1.8 g/kg
	const proteinCals = protein_g * 4;
	const remaining = Math.max(0, calorieTarget - proteinCals);
	// default split: carbs 60% of remaining, fat 40% of remaining
	const carbs_g = Math.round((remaining * 0.6) / 4);
	const fat_g = Math.round((remaining * 0.4) / 9);

	return {
		bmr,
		tdee,
		calorieTarget,
		macroTargets: { protein_g, carbs_g, fat_g },
	};
}

// Split calorie target into meal slots
export function splitIntoSlots(calorieTarget, mealsPerDay = 3) {
	// defaults for common counts
	const presets = {
		2: [50, 50],
		3: [25, 35, 40],
		4: [20, 30, 30, 20],
		5: [15, 25, 25, 20, 15],
		6: [12, 20, 20, 20, 16, 12],
	};
	const percents = presets[mealsPerDay] || presets[3];
	return percents.map((p) => ({
		percent: p,
		calories: Math.round((calorieTarget * p) / 100),
	}));
}
