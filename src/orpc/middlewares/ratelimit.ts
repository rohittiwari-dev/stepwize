import { createRatelimitMiddleware } from '@orpc/experimental-ratelimit';
import type { ORPCContext, SessionUser } from '../context';
import { globalRatelimiter, strictRatelimiter } from '../ratelimit';

/**
 * Best-effort client IP from common proxy headers. On Vercel/most proxies the
 * left-most entry of `x-forwarded-for` is the real client.
 */
export function clientIp(headers: Headers): string {
	const forwarded = headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0]!.trim();
	}

	return headers.get('x-real-ip') ?? 'unknown';
}

/**
 * GLOBAL safety-net limit — per-IP, applied to every procedure via the base
 * chain. Throws `TOO_MANY_REQUESTS` (429) when exceeded; the
 * `RatelimitHandlerPlugin` on the handler adds the `retry-after` header.
 */
export const globalRateLimit = createRatelimitMiddleware<ORPCContext>({
	limiter: () => globalRatelimiter,
	key: ({ context }) => `ip:${clientIp(context.headers)}`,
});

/**
 * STRICT opt-in limit keyed by the signed-in user. Use on sensitive routes
 * built from `protectedProcedure` (which guarantees `context.user`).
 *
 * @example
 * protectedProcedure.use(strictRateLimitByUser).handler(...)
 */
export const strictRateLimitByUser = createRatelimitMiddleware<
	ORPCContext & { user: SessionUser }
>({
	limiter: () => strictRatelimiter,
	key: ({ context }) => `user:${context.user.id}`,
});

/**
 * STRICT opt-in limit keyed by client IP. Use on sensitive routes that may be
 * called while signed out (e.g. public mutations).
 */
export const strictRateLimitByIp = createRatelimitMiddleware<ORPCContext>({
	limiter: () => strictRatelimiter,
	key: ({ context }) => `ip:${clientIp(context.headers)}`,
});
