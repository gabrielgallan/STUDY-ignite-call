import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './client/client';

export const prisma = new PrismaClient({
    adapter:
        process.env.DATABASE_PROVIDER === 'pg'
            ? new PrismaPg({ connectionString: process.env.DATABASE_URL })
            : new PrismaBetterSqlite3({
                  url: process.env.DATABASE_URL,
              }),
    log: ['query'],
});
