import express from "express";
import {
	createPlanTemplate,
	getPlanTemplates,
	getPlanTemplateById,
	updatePlanTemplate,
	deletePlanTemplate,
} from "../controllers/planTemplate.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

// Public reads
router.get("/", getPlanTemplates);
router.get("/:id", getPlanTemplateById);

// Admin-only mutating routes
router.post("/", verifyToken, isAdmin, createPlanTemplate);
router.put("/:id", verifyToken, isAdmin, updatePlanTemplate);
router.delete("/:id", verifyToken, isAdmin, deletePlanTemplate);

export default router;
