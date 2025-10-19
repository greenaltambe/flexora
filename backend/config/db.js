import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const URL = process.env.MONGO_URI;
		await mongoose.connect(URL);
		console.log(`MongoDB connected: ${URL}`.green.bold);
	} catch (error) {
		console.log(`Error: ${error.message}`.red.bold);
		process.exit(1);
	}
};

export default connectDB;
