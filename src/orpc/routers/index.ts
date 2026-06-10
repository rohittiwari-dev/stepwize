import { sessionRouter } from './session';
import { realtimeRouter } from './realtime';
import { workflowRouter } from './workflow';
import { subscriptionRouter } from './subscription';
import { licenseRouter } from './license';

export const router = {
	session: sessionRouter,
	realtime: realtimeRouter,
	workflow: workflowRouter,
	subscription: subscriptionRouter,
	license: licenseRouter,
};

export type AppRouter = typeof router;

export default router;
