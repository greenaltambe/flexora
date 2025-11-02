import mongoose from "mongoose";
const { Schema } = mongoose;

export const PrescriptionSchema = new Schema(
	{
		sets: { type: Number, default: 3 },
		reps: { type: Number, default: null }, // reps per set (null for timed)
		load_kg: { type: Number, default: null }, // weight in kg (null if bodyweight / N/A)
		time_seconds: { type: Number, default: null }, // for planks, AMRAP etc.
		rest_seconds: { type: Number, default: 60 }, // rest between sets
	},
	{ _id: false }
);

export default PrescriptionSchema;
