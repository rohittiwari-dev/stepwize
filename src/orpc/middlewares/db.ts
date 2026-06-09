import { os } from '@orpc/server';
import { prisma } from '@/lib/db';

/**
 * Injects the Prisma client into context as `db`.
 *
 * `prisma` is already a singleton, but providing it through context keeps
 * handlers free of direct imports and makes them trivial to mock in tests.
 */
export const dbMiddleware = os.middleware(({ next }) =>
	next({ context: { db: prisma } })
);
