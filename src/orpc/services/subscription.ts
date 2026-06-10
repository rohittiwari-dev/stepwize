import prisma from '@/lib/db';

const SubscriptionService = {
	async getPlans() {
		return prisma.subscriptionPlan.findMany({
			include: {
				features: true,
			},
			orderBy: {
				price: 'asc',
			},
		});
	},

	async getPlanById(planId: string) {
		return prisma.subscriptionPlan.findUnique({
			where: { id: planId },
			include: { features: true },
		});
	},

	async getUserLimits(userId: string | null) {
		if (!userId) {
			return prisma.subscriptionPlan.findUnique({
				where: { name: 'Free' },
			});
		}

		const userSub = await prisma.userSubscription.findUnique({
			where: { userId },
			include: { plan: true },
		});

		if (userSub && userSub.status === 'active') {
			return userSub.plan;
		}

		return prisma.subscriptionPlan.findUnique({
			where: { name: 'Free' },
		});
	},

	async getUserSubscription(userId: string) {
		return prisma.userSubscription.findUnique({
			where: { userId },
			include: { plan: { include: { features: true } } },
		});
	},

	async changePlan(userId: string, planId: string) {
		const plan = await prisma.subscriptionPlan.findUnique({
			where: { id: planId },
		});

		if (!plan) {
			throw new Error('Plan not found');
		}

		return prisma.userSubscription.upsert({
			where: { userId },
			update: {
				planId,
				status: 'active',
			},
			create: {
				userId,
				planId,
				status: 'active',
			},
			include: { plan: { include: { features: true } } },
		});
	},
};

export default SubscriptionService;
