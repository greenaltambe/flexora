const register = async (req, res) => {
	try {
		res.json({ message: "Register" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export { register };
