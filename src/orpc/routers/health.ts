import { publicProcedure } from '../procedures';

/**
 * Example PUBLIC router. No auth required.
 */
export const healthRouter = {
	ping: publicProcedure.handler(() => 'pong'),
};
