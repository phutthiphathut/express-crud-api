import App from "./app";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";

const startServer = async () => {
  try {
    // Load environment variables from .env file
    dotenv.config();

    // Initialize TypeORM database connection
    console.log("⏳ Initializing database connection...");
    await AppDataSource.initialize();
    console.log("✅ Database connection established successfully!");

    // Start the server
    const app = new App();

    const appName = process.env.APP_NAME || "express-crud-api";
    const appPort = parseInt(process.env.PORT || "3000", 10);

    app.listen(appName, appPort);
  } catch (error) {
    console.error("Failed to start server:", error);

    // Ensure database connection is closed on error
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }

    process.exit(1);
  }
};

// Graceful shutdown handling
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log("Database connection closed.");
  }
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log("Database connection closed.");
  }
  process.exit(0);
});

startServer();
