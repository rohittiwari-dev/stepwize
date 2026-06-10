'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@/orpc/tanstack';
import { authClient } from '@/lib/auth/clients';
import { toast } from 'sonner';

export function useSubscriptionPlans() {
	return useQuery({
		...orpc.subscription.getPlans.queryOptions(),
		staleTime: 5 * 60 * 1000,
	});
}

export function useUserLimits() {
	return useQuery({
		...orpc.subscription.getUserLimits.queryOptions(),
		staleTime: 60 * 1000,
	});
}

export function useUserSubscription() {
	return useQuery({
		...orpc.subscription.getUserSubscription.queryOptions(),
		staleTime: 60 * 1000,
	});
}

export function useChangePlan() {
	const queryClient = useQueryClient();

	return useMutation({
		...orpc.subscription.changePlan.mutationOptions(),
		onMutate: async ({ planId }) => {
			await queryClient.cancelQueries({
				queryKey: orpc.subscription.getUserLimits.queryKey(),
			});
			await queryClient.cancelQueries({
				queryKey: orpc.subscription.getUserSubscription.queryKey(),
			});

			const previousLimits = queryClient.getQueryData(
				orpc.subscription.getUserLimits.queryKey(),
			);
			const previousSubscription = queryClient.getQueryData(
				orpc.subscription.getUserSubscription.queryKey(),
			);

			const plans = queryClient.getQueryData(
				orpc.subscription.getPlans.queryKey(),
			);
			const targetPlan = (plans as any[])?.find(
				(p: any) => p.id === planId,
			);

			if (targetPlan) {
				queryClient.setQueryData(
					orpc.subscription.getUserLimits.queryKey(),
					targetPlan,
				);
			}

			return { previousLimits, previousSubscription };
		},
		onError: (_err, _vars, context) => {
			if (context?.previousLimits) {
				queryClient.setQueryData(
					orpc.subscription.getUserLimits.queryKey(),
					context.previousLimits,
				);
			}
			if (context?.previousSubscription) {
				queryClient.setQueryData(
					orpc.subscription.getUserSubscription.queryKey(),
					context.previousSubscription,
				);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: orpc.subscription.key(),
			});
		},
	});
}

export function useUpgradePlan() {
	const { data: plans } = useSubscriptionPlans();
	const changePlan = useChangePlan();

	const upgrade = async (planId: string) => {
		const targetPlan = plans?.find((p) => p.id === planId);
		if (!targetPlan) {
			return;
		}

		if (!targetPlan.polarProductId) {
			changePlan.mutate({ planId });
			return;
		}

		const { data, error } = await authClient.checkout({
			products: [targetPlan.polarProductId],
		});

		if (error) {
			toast.error(error.message || 'Failed to upgrade plan');
			return;
		}

		if (data?.url) {
			window.location.href = data.url;
		}
	};

	return {
		upgrade,
		isPending: changePlan.isPending,
		isError: changePlan.isError,
		error: changePlan.error,
	};
}

export function useCanCreateWorkflow(currentCount: number) {
	const { data: limits, isPending } = useUserLimits();
	if (isPending || !limits) {
		return { allowed: false, isPending };
	}
	if (limits.maxWorkflows === -1) {
		return { allowed: true, isPending: false };
	}
	return { allowed: currentCount < limits.maxWorkflows, isPending: false };
}

export function useCanAddTeamMember(currentCount: number) {
	const { data: limits, isPending } = useUserLimits();
	if (isPending || !limits) {
		return { allowed: false, isPending };
	}
	if (limits.maxTeamMembers === -1) {
		return { allowed: true, isPending: false };
	}
	return { allowed: currentCount < limits.maxTeamMembers, isPending: false };
}

export function useCanCreateTeam(currentCount: number) {
	const { data: limits, isPending } = useUserLimits();
	if (isPending || !limits) {
		return { allowed: false, isPending };
	}
	if (limits.maxTeams === -1) {
		return { allowed: true, isPending: false };
	}
	return { allowed: currentCount < limits.maxTeams, isPending: false };
}

export function useCanAddCredential(currentCount: number) {
	const { data: limits, isPending } = useUserLimits();
	if (isPending || !limits) {
		return { allowed: false, isPending };
	}
	if (limits.maxCredentials === -1) {
		return { allowed: true, isPending: false };
	}
	return { allowed: currentCount < limits.maxCredentials, isPending: false };
}

export function useMaxHistoryDays() {
	const { data: limits, isPending } = useUserLimits();
	return { days: limits?.historyDays ?? 0, isPending };
}
