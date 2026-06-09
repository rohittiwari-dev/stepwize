import { protectedProcedure } from '../procedures';

/**
 * Example PROTECTED router. Every procedure requires a signed-in user, so
 * `context.user` is guaranteed to be present inside the handlers.
 */
export const sessionRouter = {
	me: protectedProcedure.handler(({ context }) => context.user),
};
