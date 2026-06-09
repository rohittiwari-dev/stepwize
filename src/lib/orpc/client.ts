import type { RouterClient } from '@orpc/server';
import { RPCLink } from '@orpc/client/fetch';
import { createORPCClient } from '@orpc/client';
import { SimpleCsrfProtectionLinkPlugin } from '@orpc/client/plugins';
import router from './routers';

declare global {
	var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
	url: () => {
		if (typeof window === 'undefined') {
			throw new Error('RPCLink is not allowed on the server side.');
		}

		return `${window.location.origin}/rpc`;
	},
	// Sends the CSRF header the server's `SimpleCsrfProtectionHandlerPlugin`
	// requires (defaults match: `x-csrf-token: orpc`). Without this, every
	// browser request would be rejected with 403.
	plugins: [new SimpleCsrfProtectionLinkPlugin()],
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> =
	globalThis.$client ?? createORPCClient(link);
