import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export class UserController {
  // Register User
  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, phoneNo, email, password } = req.body;
      const user = await userService.registerUser(firstName, lastName, phoneNo, email, password);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  // Login User
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser(email, password);
      res.status(200).json(result);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(401).json({ error: errorMessage });
    }
  }

  // Get user by ID
  async getUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }
}
