import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { User } from "../entity/User";
import { userRepository } from "../repository/UserRepository";

export class UserController {
  // GET /users - Find all users with pagination
  static async findAll(request: Request, response: Response): Promise<void> {
    try {
      const page = parseInt(request.query.page as string) || 1;
      const limit = parseInt(request.query.limit as string) || 10;

      if (page < 1) {
        response.status(400).json({
          error: "Page number must be greater than 0",
        });
        return;
      }

      if (limit < 1 || limit > 100) {
        response.status(400).json({
          error: "Limit must be between 1 and 100",
        });
        return;
      }

      const result = await userRepository.findAll(page, limit);

      response.json({
        message: "Users retrieved successfully",
        ...result,
      });
    } catch (error) {
      console.error("Error in findAll:", error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  }

  // GET /users/:id - Find one user by ID
  static async findOne(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        response.status(400).json({
          error: "Invalid user ID",
        });
        return;
      }

      const user = await userRepository.findOne(id);

      if (!user) {
        response.status(404).json({
          error: "User not found",
        });
        return;
      }

      response.json({
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error in findOne:", error);
      response.status(500).json({
        error: "Internal server error",
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
          error: "Validation failed",
          details: validationErrors,
        });
        return;
      }

      const newUser = await userRepository.create(userData);

      response.status(201).json({
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      console.error("Error in create:", error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  }

  // PUT /users/:id - Update a user
  static async update(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        response.status(400).json({
          error: "Invalid user ID",
        });
        return;
      }

      const existingUser = await userRepository.findOne(id);
      if (!existingUser) {
        response.status(404).json({
          error: "User not found",
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
          error: "Validation failed",
          details: validationErrors,
        });
        return;
      }

      const updatedUser = await userRepository.update(id, request.body);

      response.json({
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error in update:", error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  }

  // DELETE /users/:id - Delete a user
  static async delete(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        response.status(400).json({
          error: "Invalid user ID",
        });
        return;
      }

      const deleted = await userRepository.delete(id);

      if (!deleted) {
        response.status(404).json({
          error: "User not found",
        });
        return;
      }

      response.json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete:", error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
