import dotenv from "dotenv";
import settings from "../../package.json";

// Load environment variables
dotenv.config();

export const AppConfig = {
  NAME: (process.env.APP_NAME as string) || "express-crud-api",
  PORT: parseInt(process.env.APP_PORT as string, 10) || 3000,
  VERSION: settings.version || "1.0.0",
  NODE_ENV: (process.env.NODE_ENV as string) || "development",
};

export const CorsConfig = {
  ORIGIN: (process.env.CORS_ORIGIN as string) || "*",
};

export const DatabaseConfig = {
  TYPE: (process.env.DATABASE_TYPE as any) || "postgres",
  HOST: (process.env.DATABASE_HOST as string) || "localhost",
  PORT: parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
  USERNAME: (process.env.DATABASE_USERNAME as string) || "postgres",
  PASSWORD: (process.env.DATABASE_PASSWORD as string) || "your-password",
  DATABASE: (process.env.DATABASE_NAME as string) || "express-crud-api",
  SYNCHRONIZE: process.env.DATABASE_SYNCHRONIZE === "true",
  LOGGING: process.env.DATABASE_LOGGING === "true",
};
