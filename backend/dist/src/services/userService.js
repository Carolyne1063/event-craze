"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailService_1 = __importDefault(require("./mailService"));
const prisma = new client_1.PrismaClient();
class UserService {
    // Register a new user
    async registerUser(firstName, lastName, phoneNo, email, password, image, role = 'USER') {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                phoneNo,
                email,
                password: hashedPassword,
                image,
                role: role || "USER",
            },
        });
        // Send a welcome email to the new user.
        await mailService_1.default.sendWelcomeEmail(user.email, user.firstName);
        return user;
    }
    // Login user
    async loginUser(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid email or password');
        }
        // Generate JWT Token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return { token, user };
    }
    // Fetch a user by ID
    async getUserById(userId) {
        return prisma.user.findUnique({ where: { id: userId } });
    }
    // Fetch all users
    async getAllUsers() {
        return prisma.user.findMany();
    }
    // Update user details
    async updateUser(userId, data) {
        if (data.password) {
            data.password = await bcrypt_1.default.hash(data.password, 10);
        }
        return prisma.user.update({ where: { id: userId }, data });
    }
    // Delete user
    async deleteUser(userId) {
        return prisma.user.delete({ where: { id: userId } });
    }
}
exports.UserService = UserService;
