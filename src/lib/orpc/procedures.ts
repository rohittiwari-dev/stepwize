import { os } from '@orpc/server';
import type { ORPCContext } from './context';
import { errors } from './errors';
import { loggerMiddleware } from './middlewares/logger';
import { globalRateLimit } from './middlewares/ratelimit';
import { dbMiddleware } from './middlewares/db';
import { sessionMiddleware } from './middlewares/session';
import { requireAuth } from './middlewares/auth';

/**
 * Builder chain — build every router off `publicProcedure` or
 * `protectedProcedure`, never `os` directly, so they all share context,
 * the error catalog, and the common middleware.
 */

/** Base builder: declares the initial context + shared typed errors. */
const base = os.$context<ORPCContext>().errors(errors);

/**
 * PUBLIC procedure. Anyone can call it. Context includes `db` and a nullable
 * `session` / `user` (populated when the caller is signed in).
 */
export const publicProcedure = base
	.use(loggerMiddleware)
	// Per-IP safety net — runs early so abusive bursts are rejected before any
	// db/session work happens.
	.use(globalRateLimit)
	.use(dbMiddleware)
	.use(sessionMiddleware);

/**
 * PROTECTED procedure. Requires a signed-in user. Context `user` is guaranteed
 * non-null inside the handler; otherwise the call throws UNAUTHORIZED.
 */
export const protectedProcedure = publicProcedure.use(requireAuth);
