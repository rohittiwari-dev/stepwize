import {
	lastLoginMethodClient,
	magicLinkClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { polarClient } from '@polar-sh/better-auth';

export const authClient = createAuthClient({
	baseURL: 'http://localhost:3000',
	plugins: [lastLoginMethodClient(), magicLinkClient(), polarClient()],
});

export const {
	signIn,
	signUp,
	useSession,
	accountInfo,
	changeEmail,
	changePassword,
	deleteUser,
	getAccessToken,
	getSession,
	linkSocial,
	listAccounts,
	refreshToken,
	listSessions,
	requestPasswordReset,
	resetPassword,
	revokeOtherSessions,
	revokeSession,
	revokeSessions,
	sendVerificationEmail,
	unlinkAccount,
	updateSession,
	signOut,
	updateUser,
	verifyEmail,
} = authClient;
