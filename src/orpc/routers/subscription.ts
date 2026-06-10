import { publicProcedure, protectedProcedure } from '../procedures';
import { changePlanValidation } from '../validations/subscription';
import SubscriptionService from '../services/subscription';

export const subscriptionRouter = {
	getPlans: publicProcedure.handler(async () => {
		return SubscriptionService.getPlans();
	}),

	getUserLimits: publicProcedure.handler(
		async ({ context: { user } }) => {
			return SubscriptionService.getUserLimits(user?.id ?? null);
		},
	),

	getUserSubscription: protectedProcedure.handler(
		async ({ context: { user } }) => {
			return SubscriptionService.getUserSubscription(user.id);
		},
	),

	changePlan: protectedProcedure
		.input(changePlanValidation)
		.handler(async ({ input, context: { user } }) => {
			return SubscriptionService.changePlan(user.id, input.planId);
		}),
};
