import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class UserService {
  // Register a new user
  async registerUser(firstName: string, lastName: string, phoneNo: string, email: string, password: string, role: 'USER' | 'ADMIN' = 'USER') {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: {
        firstName,
        lastName,
        phoneNo,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });
  }

  // Login user
  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return { token, user };
  }

  // Fetch a user by ID
  async getUserById(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  // Fetch all users
  async getAllUsers() {
    return prisma.user.findMany();
  }

  // Update user details
  async updateUser(userId: string, data: Partial<{ firstName: string; lastName: string; phoneNo: string; email: string; password: string; role: 'USER' | 'ADMIN' }>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({ where: { id: userId }, data });
  }

  // Delete user
  async deleteUser(userId: string) {
    return prisma.user.delete({ where: { id: userId } });
  }
}
