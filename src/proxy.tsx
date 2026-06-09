import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';

const AuthRoutes = ['/sign-in', '/sign-up'];
const WorkspaceRoutes = ['/dashboard'];
const PublicRoute = ['/'];

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

	if (matchRoute(pathname, PublicRoute)) {
		return NextResponse.next();
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (matchRoute(pathname, WorkspaceRoutes) && !session) {
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}

	if (matchRoute(pathname, AuthRoutes) && session) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
};

export const config = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|rpc)(.*)',
	],
};
