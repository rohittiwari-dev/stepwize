import { inngest } from '@/inngest';
import { InngestFunctions } from '@/inngest/functions';
import { serve } from 'inngest/next';

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: InngestFunctions,
	serveOrigin: process.env.INNGEST_BASE_URL,
});
