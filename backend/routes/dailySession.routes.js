import express from "express";
import {
	getTodaySession,
	getSessionByDate,
} from "../controllers/dailySession.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// Get today's generated session
router.get("/today", verifyToken, getTodaySession);

// Get session by date (YYYY-MM-DD)
router.get("/:date", verifyToken, getSessionByDate);

export default router;
