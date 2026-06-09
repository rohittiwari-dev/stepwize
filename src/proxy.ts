import { NextResponse, ProxyConfig, type NextRequest } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';
import { Session } from 'better-auth';

const AuthRoutes = ['/sign-in', '/sign-up'];
const WorkspaceRoutes = ['/dashboard'];
const PublicRoutes = ['/'];

const matchRoute = (
	pathname: string,
	routes: string[],
	type:
		| 'exact'
		| 'startsWith'
		| 'endsWith'
		| 'includes'
		| 'regex' = 'startsWith',
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

	// Public home page — must be an EXACT match. Using `startsWith` here would
	// match every path (everything starts with "/") and bypass all auth checks.
	if (matchRoute(pathname, PublicRoutes, 'exact')) {
		return NextResponse.next();
	}

	// In a proxy you read the incoming headers off the request itself —
	// `next/headers` is only available in Server Components / Route Handlers.
	const { data: session } = await betterFetch<Session>(
		'/api/auth/get-session',
		{
			baseURL: process.env.BETTER_AUTH_URL,
			headers: {
				//get the cookie from the request
				cookie: request.headers.get('cookie') || '',
			},
		},
	);

	// Protect workspace routes from unauthenticated visitors.
	if (matchRoute(pathname, WorkspaceRoutes) && !session) {
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}

	// Keep already-authenticated users out of the auth pages.
	if (matchRoute(pathname, AuthRoutes) && session) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
};

export const config: ProxyConfig = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|rpc)(.*)',
	],
};
