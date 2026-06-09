import { Inngest } from 'inngest';

export const inngest = new Inngest({
	id: 'stepwize',
	env: process.env.NODE_ENV,
	signingKey: process.env.INNGEST_SIGNING_KEY,
	eventKey: process.env.INNGEST_EVENT_KEY,
	baseUrl: process.env.INNGEST_BASE_URL,
});
