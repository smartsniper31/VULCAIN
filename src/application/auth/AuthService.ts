import jwt from 'jsonwebtoken';
import { prisma } from '@infrastructure/database/prisma.provider';
import { User } from '../../generated/prisma/client';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  static verifyToken(token: string): { id: string } {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { id: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }
}
