import { sessionRouter } from './session';
import { realtimeRouter } from './realtime';
import { workflowRouter } from './workflow';

/**
 * Root router. Mount each feature router under a namespace here.
 * Calls become `client.health.ping()`, `client.session.me()`, etc.
 */
export const router = {
	session: sessionRouter,
	realtime: realtimeRouter,
	workflow: workflowRouter,
};

export type AppRouter = typeof router;

export default router;
