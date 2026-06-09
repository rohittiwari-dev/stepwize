import { Inngest } from 'inngest';

export const inngest = new Inngest({
	id: 'stepwize',
	// NOTE: `env` is for Inngest Branch Environments (a Cloud feature) and sets
	// the `x-inngest-env` header on every request. It is NOT NODE_ENV. Setting it
	// to NODE_ENV scoped all events/syncs to a phantom "production" env on the
	// self-hosted server, so nothing matched. Leave it unset for self-hosting.
	signingKey: process.env.INNGEST_SIGNING_KEY,
	eventKey: process.env.INNGEST_EVENT_KEY,
	baseUrl: process.env.INNGEST_BASE_URL,
});
