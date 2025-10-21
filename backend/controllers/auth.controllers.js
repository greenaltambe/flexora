import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
	generateVerificationCode,
	generateJWTAndSetCookie,
	sendVerificationCode,
	sendWelcomeEmail,
	generateResetPasswordCode,
	sendResetPasswordCode,
	sendSuccessPasswordResetEmail,
} from "../utils/index.js";
import crypto from "crypto";

// Register
// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
	try {
		const { firstName, lastName, email, password, role } = req.body;

		// check if all fields are provided
		if (!firstName || !lastName || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		// check if user already exists
		const userAlreadyExists = await User.findOne({ email });
		if (userAlreadyExists) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}

		// hash password for security
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// email verification
		const { verificationCode, verificationCodeHash } =
			generateVerificationCode();

		// create new user
		const newUser = {
			firstName,
			lastName,
			email,
			password: hashedPassword,
			// Only allow role from body if explicitly 'admin'. Otherwise default via model
			// This ensures normal clients cannot escalate role
			role: role === "admin" ? "admin" : undefined,
			verificationCodeHash,
			verificationCodeExpiry: Date.now() + 24 * 60 * 60 * 1000, // valid for 24 hours
		};

		const user = await User.create(newUser);

		// // Set JWT and cookie
		// generateJWTAndSetCookie(res, user._id);

		// Send verification code to user's email
		await sendVerificationCode(user.email, verificationCode);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc, // spread operator to get all user properties
				password: undefined,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Verify email
// @desc Verify user's email
// @route POST /api/auth/verify-email
// @access Public
const verifyEmail = async (req, res) => {
	try {
		const { email, verificationCode } = req.body;

		// check if all fields are provided
		if (!email || !verificationCode) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		// check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		// check if verification code is valid
		if (user.verificationCodeExpiry < Date.now()) {
			return res.status(400).json({
				success: false,
				message: "Verification code expired",
			});
		}

		// check if verification code is valid
		const hashedCode = crypto
			.createHash("sha256")
			.update(verificationCode)
			.digest("hex");

		if (hashedCode !== user.verificationCodeHash) {
			return res.status(400).json({
				success: false,
				message: "Invalid verification code",
			});
		}

		// mark user as verified
		user.isVerified = true;
		user.verificationCodeHash = undefined;
		user.verificationCodeExpiry = undefined;
		await user.save();

		// Set JWT and cookie
		generateJWTAndSetCookie(res, user._id);

		// send success verification email
		await sendWelcomeEmail(user.email);

		// send success response
		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Logout
// @desc Logout user
// @route POST /api/auth/logout
// @access Private
const logout = async (req, res) => {
	try {
		res.clearCookie("token");
		res.status(200).json({
			success: true,
			message: "User logged out successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Login
// @desc Login user
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		// check if all fields are provided
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		// check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		// check if password is correct
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({
				success: false,
				message: "Incorrect password",
			});
		}

		// Set JWT and cookie
		generateJWTAndSetCookie(res, user._id);

		// send success response
		res.status(200).json({
			success: true,
			message: "User logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Forgot password
// @desc Forgot password
// @route POST /api/auth/forgot-password
// @access Public
const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		// check if all fields are provided
		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		// check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		// generate reset password code
		const { resetPasswordCodeHash } = generateResetPasswordCode();

		// update user with reset password code
		user.resetPasswordCodeHash = resetPasswordCodeHash;
		user.resetPasswordCodeExpiry = Date.now() + 24 * 60 * 60 * 1000; // valid for 24 hours
		await user.save();

		// send reset password code to user's email
		await sendResetPasswordCode(
			user.email,
			`${process.env.FRONTEND_URL}/reset-password/${resetPasswordCodeHash}`
		);

		// send success response
		res.status(200).json({
			success: true,
			message: "Reset password code sent successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Reset password
// @desc Reset password
// @route POST /api/auth/reset-password
// @access Public
const resetPassword = async (req, res) => {
	const { resetPasswordCodeHash } = req.params;
	const { password } = req.body;

	const user = await User.findOne({ resetPasswordCodeHash });
	if (!user) {
		return res.status(400).json({
			success: false,
			message: "User not found",
		});
	}

	// check if reset password code is valid
	if (user.resetPasswordCodeExpiry < Date.now()) {
		return res.status(400).json({
			success: false,
			message: "Reset password code expired",
		});
	}

	// hash password for security
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// update user with new password
	user.password = hashedPassword;
	user.resetPasswordCodeHash = undefined;
	user.resetPasswordCodeExpiry = undefined;
	await user.save();

	// Set JWT and cookie
	generateJWTAndSetCookie(res, user._id);

	// send success verification email
	await sendSuccessPasswordResetEmail(user.email);

	// send success response
	res.status(200).json({
		success: true,
		message: "Password reset successfully",
		user: {
			...user._doc,
			password: undefined,
		},
	});
};

// Check auth
// @desc Check auth
// @route GET /api/auth/check-auth
// @access Private
const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}
		res.status(200).json({
			success: true,
			message: "User authenticated successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export {
	register,
	verifyEmail,
	logout,
	login,
	forgotPassword,
	resetPassword,
	checkAuth,
};
