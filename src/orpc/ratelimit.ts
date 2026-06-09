import 'server-only';

import { Ratelimit } from '@upstash/ratelimit';
import { UpstashRatelimiter } from '@orpc/experimental-ratelimit/upstash-ratelimit';
import { redis } from '@/lib/redis';

/**
 * Loose per-IP safety net applied to EVERY procedure (wired into the base
 * procedure). Catches abusive bursts without interfering with normal usage.
 */
export const globalRatelimiter = new UpstashRatelimiter(
	new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(300, '60 s'),
		prefix: 'orpc:rl:global',
		analytics: false,
	})
);

/**
 * Strict limiter for sensitive / expensive routes. Opt in per-procedure via the
 * `strictRateLimitByUser` / `strictRateLimitByIp` middlewares.
 */
export const strictRatelimiter = new UpstashRatelimiter(
	new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(5, '60 s'),
		prefix: 'orpc:rl:strict',
		analytics: false,
	})
);
