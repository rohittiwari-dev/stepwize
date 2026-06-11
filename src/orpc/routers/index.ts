import { sessionRouter } from './session';
import { realtimeRouter } from './realtime';
import { workflowRouter } from './workflow';
import { subscriptionRouter } from './subscription';

export const router = {
	session: sessionRouter,
	realtime: realtimeRouter,
	workflow: workflowRouter,
	subscription: subscriptionRouter,
};

export type AppRouter = typeof router;

export default router;
