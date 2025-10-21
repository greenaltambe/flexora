import User from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
	try {
		if (!req.userId) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized - Missing user context",
			});
		}

		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		if (user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Forbidden - Admins only",
			});
		}

		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Server error",
		});
	}
};

export { isAdmin };


