import { Router } from "express";
import dotenv from "dotenv";
import userRoutes from "./userRoutes";

dotenv.config();

const APP_NAME = process.env.APP_NAME || "express-crud-api";

const router = Router();

// API routes
router.use("/users", userRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: `${APP_NAME} is running`,
    timestamp: new Date().toISOString(),
  });
});

export default router;
