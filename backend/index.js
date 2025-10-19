import colors from "colors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
connectDB();

const app = express();

const PORT = process.env.PORT || 5017;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`.blue.bold));
