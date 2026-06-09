import { os } from '@orpc/server';
import { auth } from '@/lib/auth';
import type { ORPCContext } from '../context';

/**
 * Resolves the better-auth session from the request headers and adds
 * `session` + `user` to context (both nullable — this does NOT require auth).
 *
 * Runs on public procedures so handlers can optionally personalize for a
 * signed-in user. `requireAuth` builds on top of this to enforce auth.
 */
export const sessionMiddleware = os
	.$context<ORPCContext>()
	.middleware(async ({ context, next }) => {
		const data = await auth.api.getSession({ headers: context.headers });

		return next({
			context: {
				session: data?.session ?? null,
				user: data?.user ?? null,
			},
		});
	});
