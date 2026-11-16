import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './client/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
}

const adapter =
    process.env.DATABASE_PROVIDER === 'mysql'
        ? (() => {
              const url = new URL(databaseUrl);

              return new PrismaMariaDb({
                  host: url.hostname,
                  port: Number(url.port || 3306),
                  user: decodeURIComponent(url.username),
                  password: decodeURIComponent(url.password),
                  database: decodeURIComponent(url.pathname.slice(1)),
                  connectionLimit: 5,
              });
          })()
        : new PrismaBetterSqlite3({
              url: databaseUrl,
          });

export const prisma = new PrismaClient({
    adapter,
    log: ['query'],
});
