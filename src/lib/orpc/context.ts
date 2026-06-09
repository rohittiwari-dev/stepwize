import type { auth } from '@/lib/auth';

/**
 * The *initial* context every adapter must provide when invoking the router.
 *
 * Keep this minimal — it is the only thing the Next.js route handler and the
 * server-side client need to construct per request. Everything else (db,
 * session, user) is derived from here by middleware in `./procedures`.
 */
export interface ORPCContext {
	headers: Headers;
}

type AuthSession = typeof auth.$Infer.Session;

/** The authenticated user, as inferred from the better-auth config. */
export type SessionUser = AuthSession['user'];

/** The active session row, as inferred from the better-auth config. */
export type Session = AuthSession['session'];
