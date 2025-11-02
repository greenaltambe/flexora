import express from "express";
import {
	getRecommendation,
	saveDailySession,
	logMeals,
	recipeSearchProxy,
} from "../controllers/diet.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.get("/recommendation", verifyToken, getRecommendation);
router.post("/session/:date", verifyToken, saveDailySession);
router.post("/meals/log/:date", verifyToken, logMeals);
router.get("/recipes/search", verifyToken, recipeSearchProxy);

export default router;
