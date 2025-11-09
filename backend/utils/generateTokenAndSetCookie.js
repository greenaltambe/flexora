import jwt from "jsonwebtoken";

export const generateJWTAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	const isProd = process.env.NODE_ENV === "production";

	res.cookie("token", token, {
		httpOnly: true,
		secure: isProd, // required by browsers for SameSite=None
		sameSite: isProd ? "none" : "lax",
		path: "/", // important so clearCookie matches
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
};
