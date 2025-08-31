import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { User } from "../entities/User";
import { userRepository } from "../repositories/UserRepository";
import { AppConfig } from "../configs/config";

export class UserController {
  // GET /users - Find all users with pagination
  static async findAll(request: Request, response: Response): Promise<void> {
    try {
      const page = parseInt(request.query.page as string) || 1;
      const limit = parseInt(request.query.limit as string) || 10;

      if (page < 1) {
        response.status(400).json({
          status: "FAILED",
          message: "Page number must be greater than 0",
          version: AppConfig.VERSION,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (limit < 1 || limit > 100) {
        response.status(400).json({
          status: "FAILED",
          message: "Limit must be between 1 and 100",
          version: AppConfig.VERSION,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await userRepository.findAll(page, limit);

      response.json({
        status: "SUCCESS",
        message: "Users retrieved successfully",
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
        data: {
          results: result.data,
          pagination: {
            total: result.total,
            page: result.page,
            pageSize: limit,
            totalPages: result.totalPages,
          },
        },
      });
    } catch (error) {
      console.error("Error in findAll:", error);
      response.status(500).json({
        status: "FAILED",
        message: "Internal server error",
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // GET /users/:id - Find one user by ID
  static async findOne(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        response.status(400).json({
          status: "FAILED",
          message: "Invalid user ID",
          version: AppConfig.VERSION,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const user = await userRepository.findOne(id);

      if (!user) {
        response.status(404).json({
          status: "FAILED",
          message: "User not found",
          version: AppConfig.VERSION,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      response.json({
        status: "SUCCESS",
        message: "User retrieved successfully",
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
        data: user,
      });
    } catch (error) {
      console.error("Error in findOne:", error);
      response.status(500).json({
        status: "FAILED",
        message: "Internal server error",
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // POST /users - Create a new user
  static async create(request: Request, response: Response): Promise<void> {
    try {
      const userData = plainToClass(User, request.body);

      // Validate the user data
      const errors = await validate(userData, { skipMissingProperties: true });

      if (errors.length > 0) {
        const validationErrors = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        }));

        response.status(400).json({
          status: "FAILED",
          message: "Validation failed",
          version: AppConfig.VERSION,
          timestamp: new Date().toISOString(),
          data: validationErrors,
        });
        return;
      }

      const newUser = await userRepository.create(userData);

      response.status(201).json({
        status: "SUCCESS",
        message: "User created successfully",
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
        data: newUser,
      });
    } catch (error) {
      console.error("Error in create:", error);
      response.status(500).json({
        status: "FAILED",
        message: "Internal server error",
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // PUT /users/:id - Update a user
  static async update(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        response.status(400).json({
          status: "FAILED",
          message: "Invalid user ID",
          version: AppConfig.VERSION,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const existingUser = await userRepository.findOne(id);
      if (!existingUser) {
        response.status(404).json({
          status: "FAILED",
          message: "User not found",
          version: AppConfig.VERSION,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Create a user object for validation
      const userData = plainToClass(User, {
        ...existingUser,
        ...request.body,
      });

      // Validate the updated user data
      const errors = await validate(userData, { skipMissingProperties: true });

      if (errors.length > 0) {
        const validationErrors = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        }));

        response.status(400).json({
          status: "FAILED",
          message: "Validation failed",
          version: AppConfig.VERSION,
          timestamp: new Date().toISOString(),
          data: validationErrors,
        });
        return;
      }

      const updatedUser = await userRepository.update(id, request.body);

      response.json({
        status: "SUCCESS",
        message: "User updated successfully",
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error in update:", error);
      response.status(500).json({
        status: "FAILED",
        message: "Internal server error",
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // DELETE /users/:id - Delete a user
  static async delete(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        response.status(400).json({
          status: "FAILED",
          message: "Invalid user ID",
          version: AppConfig.VERSION,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const deleted = await userRepository.delete(id);

      if (!deleted) {
        response.status(404).json({
          status: "FAILED",
          message: "User not found",
          version: AppConfig.VERSION,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      response.json({
        status: "SUCCESS",
        message: "User deleted successfully",
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error in delete:", error);
      response.status(500).json({
        status: "FAILED",
        version: AppConfig.VERSION,
        timestamp: new Date().toISOString(),
        message: "Internal server error",
      });
    }
  }
}
