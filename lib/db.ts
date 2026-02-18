/**
 * Database utilities and helpers
 * 
 * This file exports the Prisma client instance.
 * For production with Prisma Accelerate, use the Accelerate URL in DATABASE_URL.
 * For local development, use your local PostgreSQL connection string.
 */

import { prisma } from './prisma';

export { prisma };

/**
 * Helper function to check database connection
 */
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Helper function to disconnect from database
 * Useful for cleanup in scripts or tests
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
}
