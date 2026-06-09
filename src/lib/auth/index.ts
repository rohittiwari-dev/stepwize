import { betterAuth } from 'better-auth/minimal';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../db';
import {
	haveIBeenPwned,
	lastLoginMethod,
	magicLink,
	openAPI,
} from 'better-auth/plugins';

export const auth = betterAuth({
	appName: 'Stepwize',
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: true,
		revokeSessionsOnPasswordReset: true,
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ url, user, token }, ctx) => {
			// send email to user
		},
	},
	plugins: [
		lastLoginMethod(),
		haveIBeenPwned(),
		openAPI(),
		magicLink({
			sendMagicLink: async ({ email, token, url, metadata }, ctx) => {
				// send email to user
			},
		}),
	],
});
