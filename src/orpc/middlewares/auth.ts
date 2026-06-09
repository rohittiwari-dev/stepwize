import { ORPCError, os } from '@orpc/server';
import type { SessionUser } from '../context';

/**
 * Enforces authentication. Requires `user` to already be on context (provided
 * by `sessionMiddleware`), throws UNAUTHORIZED if absent, and re-provides
 * `user` narrowed to non-null so downstream handlers get a guaranteed user.
 */
export const requireAuth = os
	.$context<{ user: SessionUser | null }>()
	.middleware(({ context, next }) => {
		if (!context.user) {
			throw new ORPCError('UNAUTHORIZED');
		}

		return next({
			context: {
				user: context.user,
			},
		});
	});
