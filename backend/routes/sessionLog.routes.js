import express from "express";
import { submitSessionLog } from "../controllers/sessionLog.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// Submit session log for a date (YYYY-MM-DD)
router.post("/:date/log", verifyToken, submitSessionLog);

export default router;
