import { NextResponse, type ProxyConfig, type NextRequest } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';
import type { Session } from 'better-auth';

const AuthRoutes = ['/sign-in', '/sign-up'];
const WorkspaceRoutes = ['/dashboard'];

const matchRoute = (
	pathname: string,
	routes: string[],
	type: 'exact' | 'startsWith' | 'endsWith' | 'includes' | 'regex' = 'startsWith',
) => {
	if (type === 'exact') {
		return routes.some((route) => pathname === route);
	}
	if (type === 'startsWith') {
		return routes.some((route) => pathname.startsWith(route));
	}
	if (type === 'endsWith') {
		return routes.some((route) => pathname.endsWith(route));
	}
	if (type === 'includes') {
		return routes.some((route) => pathname.includes(route));
	}
	if (type === 'regex') {
		return routes.some((route) => new RegExp(route).test(pathname));
	}
	return false;
};

export const proxy = async (request: NextRequest) => {
	const pathname = request.nextUrl.pathname;

	// Optimistic, cookie-based session check. This is an HTTP call to the
	// better-auth handler, so the matcher below MUST NOT include /api/* —
	// otherwise this request re-enters the proxy and recurses forever.
	const { data: session } = await betterFetch<Session>(
		'/api/auth/get-session',
		{
			baseURL: process.env.BETTER_AUTH_URL,
			headers: {
				cookie: request.headers.get('cookie') || '',
			},
		},
	);

	// Protect workspace routes from unauthenticated visitors.
	if (matchRoute(pathname, WorkspaceRoutes, 'startsWith') && !session) {
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}

	// Keep already-authenticated users out of the auth pages.
	if (matchRoute(pathname, AuthRoutes, 'startsWith') && session) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
};

export const config: ProxyConfig = {
	// Scope the proxy to ONLY the routes it guards. It must never match /api/*,
	// or the betterFetch to /api/auth/get-session above will recurse infinitely.
	matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
};
