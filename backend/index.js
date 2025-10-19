import colors from "colors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

// config
dotenv.config();
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5017;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`.blue.bold));
