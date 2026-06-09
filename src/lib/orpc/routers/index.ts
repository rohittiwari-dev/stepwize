import { healthRouter } from './health';
import { sessionRouter } from './session';
import { realtimeRouter } from './realtime';

/**
 * Root router. Mount each feature router under a namespace here.
 * Calls become `client.health.ping()`, `client.session.me()`, etc.
 */
export const router = {
	health: healthRouter,
	session: sessionRouter,
	realtime: realtimeRouter,
};

export type AppRouter = typeof router;

export default router;
