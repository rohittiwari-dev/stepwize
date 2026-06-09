import {
	RPCHandler,
	BodyLimitPlugin,
	CompressionPlugin,
} from '@orpc/server/fetch';
import { onError, ORPCError } from '@orpc/server';
import { SimpleCsrfProtectionHandlerPlugin } from '@orpc/server/plugins';
import router from '@/lib/orpc/routers';

const handler = new RPCHandler(router, {
	plugins: [
		// CSRF: only accept calls that carry the oRPC client's CSRF header, so
		// procedures can't be triggered by cross-site HTML forms or navigation.
		// The client link must use `SimpleCsrfProtectionLinkPlugin` (see client.ts).
		new SimpleCsrfProtectionHandlerPlugin(),
		// Cap request body size to mitigate memory-exhaustion / DoS via huge payloads.
		new BodyLimitPlugin({ maxBodySize: 1024 * 1024 }), // 1 MB
		new CompressionPlugin(),
	],
	// Note: `StrictGetMethodPlugin` is auto-enabled by RPCHandler — GET can only
	// reach procedures explicitly marked to allow it (an extra CSRF safeguard).
	interceptors: [
		onError((error) => {
			// Defined client errors (4xx) are part of the contract — not log-worthy.
			// Only surface unexpected failures (thrown bugs, 5xx) to the server logs.
			const isExpected =
				error instanceof ORPCError &&
				error.status >= 400 &&
				error.status < 500;

			if (!isExpected) {
				console.error('[orpc] unhandled error', error);
			}
		}),
	],
});

async function handleRequest(request: Request) {
	const { response } = await handler.handle(request, {
		prefix: '/rpc',
		context: {
			// Initial context required by `ORPCContext`. Middleware derives
			// db / session / user from these headers.
			headers: request.headers,
		},
	});

	return response ?? new Response('Not found', { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
