"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const prisma = new client_1.PrismaClient();
const userService = new userService_1.UserService();
class UserController {
    // Register User
    async register(req, res) {
        try {
            const { firstName, lastName, phoneNo, email, password, image, role } = req.body;
            const user = await userService.registerUser(firstName, lastName, phoneNo, email, password, image, role);
            res.status(201).json({ message: 'User registered successfully', user });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            res.status(500).json({ error: errorMessage });
        }
    }
    // Login User
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const passwordMatch = await bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            // Generate JWT Token
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.status(200).json({ token, userId: user.id, role: user.role }); // Send the response properly
        }
        catch (error) {
            res.status(500).json({ message: 'An unexpected error occurred', error: error instanceof Error ? error.message : error });
        }
    }
    // Get user by ID
    async getUser(req, res) {
        try {
            const { userId } = req.params;
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            res.status(500).json({ error: errorMessage });
        }
    }
    // Get all users
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            res.status(500).json({ error: errorMessage });
        }
    }
    // Update user
    async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const userData = req.body;
            const updatedUser = await userService.updateUser(userId, userData);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User updated successfully', updatedUser });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            res.status(500).json({ error: errorMessage });
        }
    }
    // Delete user
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            const deletedUser = await userService.deleteUser(userId);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            res.status(500).json({ error: errorMessage });
        }
    }
}
exports.UserController = UserController;
