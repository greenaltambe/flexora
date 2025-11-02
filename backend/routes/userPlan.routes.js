import express from "express";
import {
	assignPlanToUser,
	getUserPlan,
} from "../controllers/userPlan.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// Assign a template to the current user
router.post("/assign/:templateId", verifyToken, assignPlanToUser);

// Get current user's plan
router.get("/", verifyToken, getUserPlan);

export default router;
