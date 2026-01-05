import { PrismaClient } from '../../generated/prisma/client';

// Pour éviter de créer plusieurs instances de Prisma en mode développement
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Set DATABASE_URL for Prisma if not already set (for development)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // For local SQLite development, use a dummy accelerateUrl since adapter is not available
    // In production on Render, set ACCELERATE_URL environment variable if using Accelerate
    accelerateUrl: process.env.ACCELERATE_URL || 'http://localhost:8080',
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
