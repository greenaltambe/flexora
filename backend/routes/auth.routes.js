import express from "express";
import {
	register,
	verifyEmail,
	logout,
	login,
	forgotPassword,
	resetPassword,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { checkAuth } from "../controllers/auth.controllers.js";

const router = express.Router();

// route for check auth
router.get("/check-auth", verifyToken, checkAuth);

// route for register and verify email
router.post("/register", register);
router.post("/verify-email", verifyEmail);

// route for login
router.post("/login", login);

// route for logout
router.post("/logout", logout);

// route for forgot password
router.post("/forgot-password", forgotPassword);

// route for reset password
router.post("/reset-password/:resetPasswordCodeHash", resetPassword);

export default router;
