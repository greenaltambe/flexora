import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDietStore } from "../store/diet/dietStore";
import { useAuthStore } from "../store/auth/authStore";
import toast from "react-hot-toast";
import {
	Apple,
	TrendingUp,
	Search,
	ChevronRight,
	Clock,
	Flame,
	Target,
	Info,
	Calendar,
	Check,
	ThumbsUp,
	ThumbsDown,
	Star,
} from "lucide-react";

const DietRecommendation = () => {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const {
		getDietRecommendation,
		searchRecipes,
		logMeals,
		saveDailySession,
		isLoading,
	} = useDietStore();

	const [recommendation, setRecommendation] = useState(null);
	const [todaySession, setTodaySession] = useState(null);
	const [recipes, setRecipes] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchLoading, setSearchLoading] = useState(false);
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [selectedMeals, setSelectedMeals] = useState({}); // {slotName: recipeObj}
	const [mealFeedback, setMealFeedback] = useState({}); // {slotName: {feedback, portion}}
	const [viewMode, setViewMode] = useState("recommend"); // "recommend", "plan", "log"
	const [savingPlan, setSavingPlan] = useState(false);
	const [loggingMeals, setLoggingMeals] = useState(false);

	useEffect(() => {
		loadRecommendation();
	}, [selectedDate]);

	const loadRecommendation = async () => {
		const result = await getDietRecommendation(selectedDate);
		if (result.success) {
			setRecommendation(result.data);
			// Initialize selected meals with first suggestion from each slot
			const initialSelected = {};
			const initialFeedback = {};
			result.data?.slots?.forEach((slot) => {
				if (slot.suggestions && slot.suggestions.length > 0) {
					initialSelected[slot.slotName] = slot.suggestions[0];
					initialFeedback[slot.slotName] = {
						feedback: "liked",
						portion: 1.0,
					};
				}
			});
			setSelectedMeals(initialSelected);
			setMealFeedback(initialFeedback);
		} else {
			toast.error(result.message || "Failed to load diet recommendation");
		}
	};

	const handleSelectRecipe = (slotName, recipe) => {
		setSelectedMeals((prev) => ({
			...prev,
			[slotName]: recipe,
		}));
		// Initialize feedback for newly selected meal
		if (!mealFeedback[slotName]) {
			setMealFeedback((prev) => ({
				...prev,
				[slotName]: {
					feedback: "liked",
					portion: 1.0,
				},
			}));
		}
	};

	const handleSaveMealPlan = async () => {
		if (Object.keys(selectedMeals).length === 0) {
			toast.error("Please select at least one meal");
			return;
		}

		setSavingPlan(true);
		const meals = Object.keys(selectedMeals).map((slotName) => ({
			slotName,
			plannedRecipeId: selectedMeals[slotName].externalId,
			plannedCalories: Math.round(
				selectedMeals[slotName].total_calories || 0
			),
		}));

		const result = await saveDailySession(selectedDate, meals);
		setSavingPlan(false);

		if (result.success) {
			setTodaySession(result.data);
			setViewMode("plan");
			toast.success("Meal plan saved successfully!");
		} else {
			toast.error(result.message || "Failed to save meal plan");
		}
	};

	const handleLogMeals = async () => {
		if (Object.keys(selectedMeals).length === 0) {
			toast.error("No meals to log");
			return;
		}

		setLoggingMeals(true);
		const entries = Object.keys(selectedMeals).map((slotName) => ({
			slotName,
			recipeId: selectedMeals[slotName].externalId,
			estimatedCalories: Math.round(
				(selectedMeals[slotName].total_calories || 0) *
					(mealFeedback[slotName]?.portion || 1.0)
			),
			feedback: mealFeedback[slotName]?.feedback || "liked",
			portionMultiplier: mealFeedback[slotName]?.portion || 1.0,
		}));

		const result = await logMeals(selectedDate, entries);
		setLoggingMeals(false);

		if (result.success) {
			toast.success("Meals logged successfully!");
			// Refresh recommendation to see updated data
			loadRecommendation();
		} else {
			toast.error(result.message || "Failed to log meals");
		}
	};

	const updateMealFeedback = (slotName, field, value) => {
		setMealFeedback((prev) => ({
			...prev,
			[slotName]: {
				...prev[slotName],
				[field]: value,
			},
		}));
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!searchQuery.trim()) {
			toast.error("Please enter a search term");
			return;
		}

		setSearchLoading(true);
		const result = await searchRecipes(searchQuery);
		setSearchLoading(false);

		if (result.success) {
			setRecipes(result.data?.results || []);
			if (result.data?.results?.length === 0) {
				toast.info("No recipes found. Try a different search term.");
			}
		} else {
			toast.error(result.message || "Failed to search recipes");
		}
	};

	const hasNutritionData =
		user?.profile?.activityLevel && user?.profile?.meals_per_day;

	if (!hasNutritionData) {
		return (
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="card bg-base-100 shadow-lg">
					<div className="card-body text-center py-12">
						<div className="text-6xl mb-4">🍎</div>
						<h2 className="text-2xl font-bold mb-4">
							Complete Your Nutrition Profile
						</h2>
						<p className="text-base-content/70 mb-6">
							To get personalized diet recommendations, please
							complete your nutrition preferences in Profile
							Settings.
						</p>
						<button
							className="btn btn-primary gap-2"
							onClick={() => navigate("/profile/settings")}
						>
							<Target className="w-4 h-4" />
							Go to Profile Settings
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
					<Apple className="w-8 h-8 text-primary" />
					Diet & Nutrition
				</h1>
				<p className="text-base-content/70">
					Your personalized nutrition recommendations and meal
					planning
				</p>
			</div>

			{/* View Mode Tabs */}
			<div className="tabs tabs-boxed mb-6 bg-base-200 p-1">
				<a
					className={`tab ${
						viewMode === "recommend" ? "tab-active" : ""
					}`}
					onClick={() => setViewMode("recommend")}
				>
					<Target className="w-4 h-4 mr-2" />
					Recommendations
				</a>
				<a
					className={`tab ${viewMode === "plan" ? "tab-active" : ""}`}
					onClick={() => setViewMode("plan")}
				>
					<Check className="w-4 h-4 mr-2" />
					My Plan
				</a>
				<a
					className={`tab ${viewMode === "log" ? "tab-active" : ""}`}
					onClick={() => setViewMode("log")}
				>
					<Star className="w-4 h-4 mr-2" />
					Log Meals
				</a>
			</div>

			{/* Macro Goals Card */}
			{isLoading && !recommendation ? (
				<div className="card bg-base-100 shadow-lg mb-6">
					<div className="card-body">
						<div className="flex justify-center py-12">
							<span className="loading loading-spinner loading-lg"></span>
						</div>
					</div>
				</div>
			) : recommendation ? (
				<div className="card bg-base-100 shadow-lg mb-6">
					<div className="card-body">
						<h2 className="card-title mb-4 flex items-center gap-2">
							<TrendingUp className="w-6 h-6" />
							Your Daily Nutrition Goals
						</h2>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{/* Calories */}
							<div className="stat bg-base-200 rounded-lg p-4">
								<div className="stat-figure text-primary">
									<Flame className="w-8 h-8" />
								</div>
								<div className="stat-title text-xs">
									Daily Calories
								</div>
								<div className="stat-value text-2xl text-primary">
									{recommendation.calorieTarget || "N/A"}
								</div>
								<div className="stat-desc">kcal/day</div>
							</div>

							{/* Protein */}
							<div className="stat bg-base-200 rounded-lg p-4">
								<div className="stat-title text-xs">
									Protein
								</div>
								<div className="stat-value text-2xl text-success">
									{recommendation.macroTargets?.protein_g ||
										"N/A"}
								</div>
								<div className="stat-desc">grams/day</div>
							</div>

							{/* Carbs */}
							<div className="stat bg-base-200 rounded-lg p-4">
								<div className="stat-title text-xs">
									Carbohydrates
								</div>
								<div className="stat-value text-2xl text-warning">
									{recommendation.macroTargets?.carbs_g ||
										"N/A"}
								</div>
								<div className="stat-desc">grams/day</div>
							</div>

							{/* Fats */}
							<div className="stat bg-base-200 rounded-lg p-4">
								<div className="stat-title text-xs">Fats</div>
								<div className="stat-value text-2xl text-error">
									{recommendation.macroTargets?.fat_g ||
										"N/A"}
								</div>
								<div className="stat-desc">grams/day</div>
							</div>
						</div>
					</div>
				</div>
			) : null}

			{/* Recommendations View */}
			{viewMode === "recommend" && recommendation?.slots && (
				<div className="space-y-6">
					{recommendation.slots.map((slot) => (
						<div
							key={slot.slotName}
							className="card bg-base-100 shadow-lg"
						>
							<div className="card-body">
								<h3 className="card-title flex items-center justify-between">
									<span className="flex items-center gap-2">
										<Clock className="w-5 h-5" />
										{slot.slotName}
									</span>
									<span className="badge badge-primary">
										Target: {slot.targetCalories} kcal
									</span>
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
									{slot.suggestions?.map((recipe, idx) => (
										<div
											key={recipe.externalId || idx}
											className={`card bg-base-200 shadow-md hover:shadow-xl transition-all cursor-pointer ${
												selectedMeals[slot.slotName]
													?.externalId ===
												recipe.externalId
													? "ring-2 ring-primary"
													: ""
											}`}
											onClick={() =>
												handleSelectRecipe(
													slot.slotName,
													recipe
												)
											}
										>
											{recipe.image && (
												<figure>
													<img
														src={recipe.image}
														alt={recipe.title}
														className="w-full h-40 object-cover"
													/>
												</figure>
											)}
											<div className="card-body p-4">
												<h4 className="font-semibold text-sm line-clamp-2">
													{recipe.title}
												</h4>
												<div className="flex items-center gap-3 text-xs text-base-content/70 mt-2">
													<span className="flex items-center gap-1">
														<Clock className="w-3 h-3" />
														{recipe.prep_minutes ||
															0}{" "}
														min
													</span>
													<span className="flex items-center gap-1">
														<Flame className="w-3 h-3" />
														{Math.round(
															recipe.total_calories ||
																0
														)}{" "}
														kcal
													</span>
												</div>
												<div className="card-actions justify-between items-center mt-3">
													{selectedMeals[
														slot.slotName
													]?.externalId ===
													recipe.externalId ? (
														<span className="badge badge-success gap-1">
															<Check className="w-3 h-3" />
															Selected
														</span>
													) : (
														<button
															className="btn btn-primary btn-xs"
															onClick={(e) => {
																e.stopPropagation();
																handleSelectRecipe(
																	slot.slotName,
																	recipe
																);
															}}
														>
															Select
														</button>
													)}
													{recipe.url && (
														<a
															href={recipe.url}
															target="_blank"
															rel="noopener noreferrer"
															className="link link-primary text-xs"
															onClick={(e) =>
																e.stopPropagation()
															}
														>
															View Recipe
														</a>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					))}

					{/* Save Plan Button */}
					<div className="flex justify-center">
						<button
							className="btn btn-primary btn-lg gap-2"
							onClick={handleSaveMealPlan}
							disabled={
								savingPlan ||
								Object.keys(selectedMeals).length === 0
							}
						>
							{savingPlan ? (
								<span className="loading loading-spinner"></span>
							) : (
								<Check className="w-5 h-5" />
							)}
							Save Meal Plan
						</button>
					</div>
				</div>
			)}

			{/* My Plan View */}
			{viewMode === "plan" && (
				<div className="card bg-base-100 shadow-lg">
					<div className="card-body">
						<h2 className="card-title mb-4">
							<Calendar className="w-6 h-6" />
							Your Meal Plan for {selectedDate}
						</h2>

						{Object.keys(selectedMeals).length > 0 ? (
							<div className="space-y-4">
								{Object.entries(selectedMeals).map(
									([slotName, recipe]) => (
										<div
											key={slotName}
											className="card bg-base-200"
										>
											<div className="card-body p-4">
												<div className="flex flex-col md:flex-row gap-4">
													{recipe.image && (
														<img
															src={recipe.image}
															alt={recipe.title}
															className="w-full md:w-32 h-32 object-cover rounded-lg"
														/>
													)}
													<div className="flex-1">
														<h3 className="font-bold">
															{slotName}
														</h3>
														<p className="text-sm">
															{recipe.title}
														</p>
														<div className="flex gap-4 mt-2 text-sm text-base-content/70">
															<span className="flex items-center gap-1">
																<Clock className="w-3 h-3" />
																{
																	recipe.prep_minutes
																}{" "}
																min
															</span>
															<span className="flex items-center gap-1">
																<Flame className="w-3 h-3" />
																{Math.round(
																	recipe.total_calories
																)}{" "}
																kcal
															</span>
														</div>
														{recipe.url && (
															<a
																href={
																	recipe.url
																}
																target="_blank"
																rel="noopener noreferrer"
																className="link link-primary text-sm mt-2 inline-flex items-center gap-1"
															>
																View Recipe
																<ChevronRight className="w-3 h-3" />
															</a>
														)}
													</div>
												</div>
											</div>
										</div>
									)
								)}

								<div className="alert alert-info">
									<Info className="w-5 h-5" />
									<span>
										Your meal plan is saved! Switch to the
										"Log Meals" tab to track what you
										actually ate.
									</span>
								</div>
							</div>
						) : (
							<div className="text-center py-12">
								<p className="text-base-content/70 mb-4">
									No meal plan saved yet
								</p>
								<button
									className="btn btn-primary"
									onClick={() => setViewMode("recommend")}
								>
									Create Meal Plan
								</button>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Log Meals View */}
			{viewMode === "log" && (
				<div className="card bg-base-100 shadow-lg">
					<div className="card-body">
						<h2 className="card-title mb-4">
							<Star className="w-6 h-6" />
							Log Your Meals
						</h2>

						{Object.keys(selectedMeals).length > 0 ? (
							<div className="space-y-6">
								{Object.entries(selectedMeals).map(
									([slotName, recipe]) => (
										<div
											key={slotName}
											className="card bg-base-200"
										>
											<div className="card-body p-4">
												<div className="flex flex-col md:flex-row gap-4">
													{recipe.image && (
														<img
															src={recipe.image}
															alt={recipe.title}
															className="w-full md:w-32 h-32 object-cover rounded-lg"
														/>
													)}
													<div className="flex-1">
														<h3 className="font-bold mb-1">
															{slotName}
														</h3>
														<p className="text-sm mb-3">
															{recipe.title}
														</p>

														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															{/* Feedback */}
															<div className="form-control">
																<label className="label">
																	<span className="label-text text-xs">
																		How was
																		it?
																	</span>
																</label>
																<select
																	className="select select-bordered select-sm"
																	value={
																		mealFeedback[
																			slotName
																		]
																			?.feedback ||
																		"liked"
																	}
																	onChange={(
																		e
																	) =>
																		updateMealFeedback(
																			slotName,
																			"feedback",
																			e
																				.target
																				.value
																		)
																	}
																>
																	<option value="liked">
																		😊 Liked
																	</option>
																	<option value="too_heavy">
																		😰 Too
																		Heavy
																	</option>
																	<option value="too_light">
																		😕 Too
																		Light
																	</option>
																</select>
															</div>

															{/* Portion */}
															<div className="form-control">
																<label className="label">
																	<span className="label-text text-xs">
																		Portion
																		Size
																	</span>
																</label>
																<select
																	className="select select-bordered select-sm"
																	value={
																		mealFeedback[
																			slotName
																		]
																			?.portion ||
																		1.0
																	}
																	onChange={(
																		e
																	) =>
																		updateMealFeedback(
																			slotName,
																			"portion",
																			parseFloat(
																				e
																					.target
																					.value
																			)
																		)
																	}
																>
																	<option value="0.5">
																		Half
																		(50%)
																	</option>
																	<option value="0.75">
																		3/4
																		(75%)
																	</option>
																	<option value="1.0">
																		Full
																		(100%)
																	</option>
																	<option value="1.25">
																		1.25x
																		(125%)
																	</option>
																	<option value="1.5">
																		1.5x
																		(150%)
																	</option>
																	<option value="2.0">
																		Double
																		(200%)
																	</option>
																</select>
															</div>
														</div>

														<div className="mt-3 text-sm text-base-content/70">
															<span className="flex items-center gap-1">
																<Flame className="w-3 h-3" />
																Estimated: ~
																{Math.round(
																	recipe.total_calories *
																		(mealFeedback[
																			slotName
																		]
																			?.portion ||
																			1.0)
																)}{" "}
																kcal
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									)
								)}

								<div className="flex justify-center mt-6">
									<button
										className="btn btn-primary btn-lg gap-2"
										onClick={handleLogMeals}
										disabled={loggingMeals}
									>
										{loggingMeals ? (
											<span className="loading loading-spinner"></span>
										) : (
											<Check className="w-5 h-5" />
										)}
										Log All Meals
									</button>
								</div>
							</div>
						) : (
							<div className="text-center py-12">
								<p className="text-base-content/70 mb-4">
									No meals to log yet
								</p>
								<button
									className="btn btn-primary"
									onClick={() => setViewMode("recommend")}
								>
									Select Meals First
								</button>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Recipe Search */}
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<h2 className="card-title mb-4 flex items-center gap-2">
						<Search className="w-6 h-6" />
						Search Recipes
					</h2>

					<form onSubmit={handleSearch} className="mb-6">
						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Search for healthy recipes..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="input input-bordered flex-1"
							/>
							<button
								type="submit"
								className="btn btn-primary gap-2"
								disabled={searchLoading}
							>
								{searchLoading ? (
									<span className="loading loading-spinner loading-sm"></span>
								) : (
									<Search className="w-4 h-4" />
								)}
								Search
							</button>
						</div>
					</form>

					{/* Recipe Results */}
					{recipes.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{recipes.map((recipe) => (
								<div
									key={recipe.id}
									className="card bg-base-200 shadow hover:shadow-lg transition-shadow"
								>
									{recipe.image && (
										<figure>
											<img
												src={recipe.image}
												alt={recipe.title}
												className="w-full h-48 object-cover"
											/>
										</figure>
									)}
									<div className="card-body p-4">
										<h3 className="card-title text-base">
											{recipe.title}
										</h3>
										<div className="flex items-center gap-4 text-sm text-base-content/70">
											{recipe.readyInMinutes && (
												<span className="flex items-center gap-1">
													<Clock className="w-3 h-3" />
													{recipe.readyInMinutes} min
												</span>
											)}
											{recipe.servings && (
												<span>
													{recipe.servings} servings
												</span>
											)}
										</div>
										{recipe.sourceUrl && (
											<div className="card-actions justify-end mt-2">
												<a
													href={recipe.sourceUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary btn-sm gap-2"
												>
													View Recipe
													<ChevronRight className="w-3 h-3" />
												</a>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					) : searchQuery && !searchLoading ? (
						<div className="text-center py-8 text-base-content/70">
							<p>
								No recipes found. Try a different search term.
							</p>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default DietRecommendation;
