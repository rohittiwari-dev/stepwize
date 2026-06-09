import { inngest } from '..';

export const helloWorld = inngest.createFunction(
	{ id: 'hello-world', triggers: { event: 'test/hello' } },
	async ({ event }) => {
		console.log(event.data);
	},
);
