import { type } from '@orpc/server';
import { protectedProcedure } from '../procedures';
import { strictRateLimitByUser } from '../middlewares/ratelimit';
import { publisher } from '../realtime/publisher';

/**
 * Example REALTIME router using the Upstash-backed publisher.
 *
 * - `onNotification` is a streaming (Server-Sent Events) subscription: the
 *   handler is an async generator that yields each new event to the client.
 * - `notify` publishes an event (strict rate-limited per user).
 */
export const realtimeRouter = {
	/**
	 * Live stream of the current user's notifications. Stays open until the
	 * client disconnects (`signal` aborts → the subscription auto-unsubscribes).
	 */
	onNotification: protectedProcedure.handler(async function* ({
		context,
		signal,
	}) {
		for await (const event of publisher.subscribe('notification.created', {
			signal,
		})) {
			// Server-side fan-out filter: only this user's notifications reach the
			// client. For high fan-out, publish to a per-user channel instead
			// (e.g. a dynamic event key) so each instance only polls its own stream.
			if (event.userId === context.user.id) {
				yield event;
			}
		}
	}),

	/**
	 * Publish a notification to the current user. Strict-limited per user.
	 *
	 * NOTE: `type<>()` gives compile-time typing only — add a validation library
	 * (e.g. zod) and use `.input(schema)` for runtime validation in production.
	 */
	notify: protectedProcedure
		.use(strictRateLimitByUser)
		.input(type<{ message: string }>())
		.handler(async ({ input, context }) => {
			const event = {
				id: crypto.randomUUID(),
				userId: context.user.id,
				message: input.message,
				createdAt: new Date().toISOString(),
			};

			await publisher.publish('notification.created', event);

			return event;
		}),
};
