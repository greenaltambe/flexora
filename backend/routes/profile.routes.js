import express from "express";
import {
	getProfile,
	updateProfile,
	completeOnboarding,
	getAllUsers,
	getUserById,
	forceCompleteOnboarding,
} from "../controllers/profile.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

// Regular user routes
router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateProfile); // partial update allowed
router.post("/onboard", verifyToken, completeOnboarding);

// Admin routes
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/users/:id", verifyToken, isAdmin, getUserById);
router.patch("/users/:id/force-onboarding", verifyToken, isAdmin, forceCompleteOnboarding);


export default router;