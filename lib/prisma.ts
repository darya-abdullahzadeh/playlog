// Note: Run `npm run db:generate` first to generate Prisma Client
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isAccelerate = process.env.DATABASE_URL?.startsWith("prisma://");

let prismaConfig: ConstructorParameters<typeof PrismaClient>[0];

if (isAccelerate) {
  // Use Prisma Accelerate
  prismaConfig = {
    accelerateUrl: process.env.DATABASE_URL!,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  };
} else {
  // Use PostgreSQL adapter for local development
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  
  prismaConfig = {
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  };
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(prismaConfig);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;