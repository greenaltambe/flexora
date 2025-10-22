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

// auth routes
router.get("/check-auth", verifyToken, checkAuth); // check auth
router.post("/register", register); // register
router.post("/verify-email", verifyEmail); // verify email
router.post("/login", login); // login
router.post("/logout", logout); // logout
router.post("/forgot-password", forgotPassword); // forgot password
router.post("/reset-password/:resetPasswordCodeHash", resetPassword); // reset password

export default router;
