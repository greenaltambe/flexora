import express from "express";
import {
	getStreak,
	getStreakSummaryController,
	addFreezeDayController,
	getMilestones,
	acknowledgeMilestoneController,
	checkStreakStatusController,
	getWeeklyConsistency,
} from "../controllers/streak.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getStreak);
router.get("/summary", verifyToken, getStreakSummaryController);
router.get("/status", verifyToken, checkStreakStatusController);
router.post("/freeze", verifyToken, addFreezeDayController);
router.get("/milestones", verifyToken, getMilestones);
router.put("/milestone/:type/acknowledge", verifyToken, acknowledgeMilestoneController);
router.get("/consistency", verifyToken, getWeeklyConsistency);

export default router;
