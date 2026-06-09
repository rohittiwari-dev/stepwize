import 'server-only';

import { UpstashRedisPublisher } from '@orpc/experimental-publisher/upstash-redis';
import { redis } from '@/lib/redis';

/**
 * App-wide realtime event map. Each key is a channel; **payloads must be objects**.
 *
 * Add new events here — procedures then get full type-safety on both
 * `publisher.publish(event, payload)` and `publisher.subscribe(event)`.
 */
export type AppEvents = {
	'notification.created': {
		id: string;
		userId: string;
		message: string;
		createdAt: string;
	};
};

declare global {
	// eslint-disable-next-line no-var
	var $publisher: UpstashRedisPublisher<AppEvents> | undefined;
}

/**
 * The single publisher instance. Backed by Upstash Redis, so publish/subscribe
 * works across serverless instances (in-memory publishers silently drop events
 * when a different instance handles the publish vs. the subscription).
 *
 * Reused across dev hot-reloads via `globalThis` to avoid leaking connections.
 */
export const publisher =
	globalThis.$publisher ??
	new UpstashRedisPublisher<AppEvents>(redis, {
		prefix: 'orpc:pub:',
		// Briefly retain events so a client that reconnects (e.g. after a
		// serverless function streaming-timeout) can resume from its last event
		// id without missing anything.
		resumeRetentionSeconds: 120,
	});

if (process.env.NODE_ENV !== 'production') {
	globalThis.$publisher = publisher;
}
