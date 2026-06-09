import { os } from '@orpc/server';

/**
 * Logs the path + duration of every call. Disabled in production to avoid noise.
 */
export const loggerMiddleware = os.middleware(async ({ next, path }) => {
	if (process.env.NODE_ENV === 'production') {
		return next();
	}

	const start = Date.now();
	try {
		return await next();
	} finally {
		console.log(`[orpc] ${path.join('.')} ${Date.now() - start}ms`);
	}
});
