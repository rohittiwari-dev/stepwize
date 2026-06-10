import { betterAuth } from 'better-auth/minimal';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../db';
import { haveIBeenPwned, lastLoginMethod, openAPI } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import {
	polar,
	checkout,
	portal,
	usage,
	webhooks,
} from '@polar-sh/better-auth';
import polarClient from '../polar';
import LicenseService from '@/orpc/services/license';

async function downgradeToFree(customerEmail: string | null | undefined) {
	if (!customerEmail) {
		return;
	}
	const [freePlan, user] = await Promise.all([
		prisma.subscriptionPlan.findUnique({ where: { name: 'Free' } }),
		prisma.user.findUnique({ where: { email: customerEmail } }),
	]);

	if (!freePlan || !user) {
		return;
	}

	await prisma.userSubscription.upsert({
		where: { userId: user.id },
		update: {
			planId: freePlan.id,
			polarSubscriptionId: null,
			status: 'active',
		},
		create: {
			userId: user.id,
			planId: freePlan.id,
			status: 'active',
		},
	});
}

export const auth = betterAuth({
	appName: 'Stepwize',
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: true,
		revokeSessionsOnPasswordReset: true,
	},
	emailVerification: {
		sendVerificationEmail: async () => {},
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					const freePlan = await prisma.subscriptionPlan.findUnique({
						where: { name: 'Free' },
					});
					if (!freePlan) {
						return;
					}

					await prisma.userSubscription.create({
						data: {
							userId: user.id,
							planId: freePlan.id,
							status: 'active',
						},
					});
				},
			},
		},
	},
	plugins: [
		lastLoginMethod(),
		haveIBeenPwned(),
		openAPI(),
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: async () => {
						const plans = await prisma.subscriptionPlan.findMany({
							where: { polarProductId: { not: null } },
						});
						return plans.map((plan) => ({
							productId: plan.polarProductId!,
							slug: plan.name.toLowerCase().replace(/\s+/g, '-'),
						}));
					},
					successUrl:
						'/dashboard?upgraded=true&checkout_id={CHECKOUT_ID}',
					authenticatedUsersOnly: true,
				}),
				portal(),
				usage(),
				webhooks({
					secret: process.env.POLAR_WEBHOOK_SECRET!,
					onOrderPaid: async (payload) => {
						const polarProductId = payload.data.product?.id;
						const customerEmail = payload.data.customer.email;
						const orderId = payload.data.id;

						if (!polarProductId || !customerEmail) {
							return;
						}

						const plan = await prisma.subscriptionPlan.findUnique({
							where: { polarProductId },
						});

						if (!plan) {
							return;
						}

						if (plan.name === 'Self Host') {
							await LicenseService.createLicense(customerEmail, orderId);
							return;
						}

						const user = await prisma.user.findUnique({
							where: { email: customerEmail },
						});

						if (!user) {
							return;
						}

						await prisma.userSubscription.upsert({
							where: { userId: user.id },
							update: {
								planId: plan.id,
								polarSubscriptionId:
									payload.data.subscription?.id ?? null,
								status: 'active',
							},
							create: {
								userId: user.id,
								planId: plan.id,
								polarSubscriptionId:
									payload.data.subscription?.id ?? null,
								status: 'active',
							},
						});
					},
					onSubscriptionCanceled: async (payload) => {
						await downgradeToFree(payload.data.customer.email);
					},
					onSubscriptionRevoked: async (payload) => {
						await downgradeToFree(payload.data.customer.email);
					},
				}),
			],
		}),
		nextCookies(),
	],
});
