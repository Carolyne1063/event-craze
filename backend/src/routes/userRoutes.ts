import express from 'express';
import asyncHandler from 'express-async-handler';
import { UserController } from '../controllers/userController';

const router = express.Router();
const userController = new UserController();

// Register User
router.post('/register', asyncHandler((req, res) => userController.register(req, res)));

// Login User
router.post('/login', asyncHandler((req, res) => userController.login(req, res)));

// Get user by ID
// Get user by ID
router.get('/:userId', asyncHandler(async (req, res) => {
    await userController.getUser(req, res);
  }));
  // Get all users
router.get('/', asyncHandler((req, res) => userController.getAllUsers(req, res)));



// Update user
router.put('/:userId', asyncHandler(async (req, res) => {
  await userController.updateUser(req, res);
}));

// Delete user
router.delete('/:userId', asyncHandler(async (req, res) => {
  await userController.deleteUser(req, res);
}));

export default router;
