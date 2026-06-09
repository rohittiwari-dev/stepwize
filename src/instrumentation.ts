export async function register() {
	// `register` runs in every runtime (Node.js AND Edge). The oRPC server-side
	// client pulls in Prisma, which depends on Node core modules (node:path,
	// node:url) that don't exist in the Edge Runtime. It's also only useful on
	// the Node.js server (it lets RSC calls run in-process instead of over HTTP),
	// so guard the import to the Node.js runtime.
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		await import('./lib/orpc/server');
	}
}
