import { Router } from "express";
import userRoutes from "./userRoutes";
import { AppConfig } from "../configs/config";

const router = Router();

// API routes
router.use("/users", userRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "SUCCESS",
    message: `${AppConfig.NAME} is running`,
    version: AppConfig.VERSION,
    timestamp: new Date().toISOString(),
  });
});

export default router;
