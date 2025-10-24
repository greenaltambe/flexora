import User from "../models/user.model.js";

const getProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId).select(
			"firstName lastName email profile onboardingCompleted role"
		);
		if (!user) return res.status(404).json({ message: "User not found" });
		return res.json({ user });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

const updateProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const update = {};

		// allow partial updates; only allow profile fields
		if (req.body.profile) update.profile = { ...req.body.profile };
		if (typeof req.body.onboardingCompleted === "boolean")
			update.onboardingCompleted = req.body.onboardingCompleted;

		const user = await User.findByIdAndUpdate(
			userId,
			{ $set: update },
			{ new: true, runValidators: true }
		).select("firstName lastName email profile onboardingCompleted");

		return res.json({ user });
	} catch (err) {
		console.error(err);
		return res.status(400).json({ message: err.message });
	}
};

const completeOnboarding = async (req, res) => {
	try {
		const userId = req.user.id;
		const payload = req.body.profile || {};
		const skipBaseline = req.body.skipBaseline;

		// If skipBaseline is true, set onboardingCompleted to false
		// This allows users to complete onboarding without baseline metrics
		const update = {
			profile: payload,
			onboardingCompleted: skipBaseline ? false : true,
		};

		const user = await User.findByIdAndUpdate(
			userId,
			{ $set: update },
			{ new: true, runValidators: true }
		).select("profile onboardingCompleted");

		return res.json({ user });
	} catch (err) {
		console.error(err);
		return res.status(400).json({ message: err.message });
	}
};

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({})
			.select("firstName lastName email profile onboardingCompleted role createdAt")
			.sort({ createdAt: -1 });
		return res.json({ users });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

const getUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId).select(
			"firstName lastName email profile onboardingCompleted role createdAt"
		);
		if (!user) return res.status(404).json({ message: "User not found" });
		return res.json({ user });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

const forceCompleteOnboarding = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findByIdAndUpdate(
			userId,
			{ $set: { onboardingCompleted: true } },
			{ new: true }
		).select("onboardingCompleted");
		if (!user) return res.status(404).json({ message: "User not found" });
		return res.json({ user });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

export {
	getProfile,
	updateProfile,
	completeOnboarding,
	getAllUsers,
	getUserById,
	forceCompleteOnboarding,
};
