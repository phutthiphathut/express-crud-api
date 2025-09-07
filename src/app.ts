import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { AppConfig } from "./configs/config";

// Custom error interface
interface CustomError extends Error {
  statusCode?: number;
}

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS middleware
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Logging middleware
    this.app.use(morgan("combined"));

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Request timeout middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const timeout = setTimeout(() => {
        if (!res.headersSent) {
          res.status(408).json({
            error: "Request timeout",
          });
        }
      }, 30000); // 30 seconds timeout

      res.on("finish", () => {
        clearTimeout(timeout);
      });

      next();
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use("/api", routes);

    // Root endpoint
    this.app.get("/", (req: Request, res: Response) => {
      res.json({
        status: "SUCCESS",
        message: `${AppConfig.NAME} is running`,
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
        data: {
          endpoints: {
            health: "/api/health",
            users: {
              getAll: "GET /api/users?page=1&limit=10",
              getOne: "GET /api/users/:id",
              create: "POST /api/users",
              update: "PUT /api/users/:id",
              delete: "DELETE /api/users/:id",
            },
          },
        },
      });
    });

    // 404 handler
    this.app.use("*", (req: Request, res: Response) => {
      res.status(404).json({
        status: "FAILED",
        message: `Route ${req.originalUrl} not found, the requested resource does not exist`,
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use(
      (error: CustomError, req: Request, res: Response, next: NextFunction) => {
        console.error("Global error handler:", {
          message: error.message,
          stack: error.stack,
          url: req.originalUrl,
          method: req.method,
          ip: req.ip,
          userAgent: req.get("User-Agent"),
        });

        const statusCode = error.statusCode || 500;
        const message = error.statusCode
          ? error.message
          : "Internal server error";

        res.status(statusCode).json({
          error: message,
          ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
        });
      }
    );

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      process.exit(1);
    });
  }

  public listen(appName: string, port: number = 3000): void {
    this.app.listen(port, () => {
      console.log(`🚀 ${appName} is running on http://localhost:${port}`);
      console.log(
        `📖 API Documentation available at http://localhost:${port}/`
      );
    });
  }
}

export default App;

