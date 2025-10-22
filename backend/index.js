import colors from "colors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import exerciseRoutes from "./routes/exercise.routes.js";

// config
dotenv.config();
connectDB();

const app = express();

const frontendUrl = process.env.FRONTEND_URL;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: frontendUrl, credentials: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);

const PORT = process.env.PORT || 5017;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`.blue.bold));
