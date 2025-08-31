import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

// GET /api/users - Get all users with pagination
router.get("/", UserController.findAll);

// GET /api/users/:id - Get user by ID
router.get("/:id", UserController.findOne);

// POST /api/users - Create new user
router.post("/", UserController.create);

// PUT /api/users/:id - Update user by ID
router.put("/:id", UserController.update);

// DELETE /api/users/:id - Delete user by ID
router.delete("/:id", UserController.delete);

export default router;
