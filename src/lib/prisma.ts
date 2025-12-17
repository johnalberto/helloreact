// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // ¡Esto te mostrará el SQL nativo en la consola! Útil para ti.
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;