'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
	IconBrandGoogle,
	IconLink,
	IconLinkOff,
	IconLoader2,
	IconShieldCheck,
	IconMail,
} from '@tabler/icons-react';
import { listAccounts, linkSocial, unlinkAccount } from '@/lib/auth/clients';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/* ── Types ── */

type AccountInfo = {
	id: string;
	providerId: string;
	accountId: string;
};

type ProviderConfig = {
	id: string;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	bgColor: string;
	borderColor: string;
};

/* ── Provider Registry ── */

const PROVIDERS: ProviderConfig[] = [
	{
		id: 'google',
		name: 'Google',
		icon: IconBrandGoogle,
		color: 'text-red-500 dark:text-red-400',
		bgColor: 'bg-red-500/10 dark:bg-red-500/15',
		borderColor: 'border-red-500/20 dark:border-red-500/25',
	},
	{
		id: 'credential',
		name: 'Email & Password',
		icon: IconMail,
		color: 'text-blue-500 dark:text-blue-400',
		bgColor: 'bg-blue-500/10 dark:bg-blue-500/15',
		borderColor: 'border-blue-500/20 dark:border-blue-500/25',
	},
];

/* ── Component ── */

const ConnectedAccounts = () => {
	const [accounts, setAccounts] = useState<AccountInfo[]>([]);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState<string | null>(null);

	const fetchAccounts = useCallback(async () => {
		try {
			const { data } = await listAccounts();
			setAccounts(
				(data ?? []).map((a) => ({
					id: a.id,
					providerId: a.providerId,
					accountId: a.accountId,
				})),
			);
		} catch {
			toast.error('Failed to load connected accounts.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAccounts();
	}, [fetchAccounts]);

	const handleLink = async (providerId: string) => {
		setActionLoading(providerId);
		try {
			const { error } = await linkSocial({
				provider: providerId as 'google',
				callbackURL: '/dashboard/settings/profile',
			});
			if (error) {
				toast.error(error.message || `Failed to link ${providerId}.`);
			}
			// On success, a redirect happens
		} catch (err: any) {
			toast.error(err.message || `Failed to link ${providerId}.`);
		} finally {
			setActionLoading(null);
		}
	};

	const handleUnlink = async (providerId: string) => {
		if (accounts.length <= 1) {
			toast.error(
				'You must keep at least one authentication method connected.',
			);
			return;
		}

		setActionLoading(providerId);
		try {
			const { error } = await unlinkAccount({
				providerId,
			});
			if (error) {
				toast.error(error.message || `Failed to unlink ${providerId}.`);
			} else {
				toast.success('Account unlinked successfully.');
				await fetchAccounts();
			}
		} catch (err: any) {
			toast.error(err.message || `Failed to unlink ${providerId}.`);
		} finally {
			setActionLoading(null);
		}
	};

	if (loading) {
		return <ConnectedAccountsSkeleton />;
	}

	return (
		<div className="space-y-3">
			{PROVIDERS.map((provider) => {
				const connected = accounts.find(
					(a) => a.providerId === provider.id,
				);
				const Icon = provider.icon;
				const isActionLoading = actionLoading === provider.id;
				const isCredential = provider.id === 'credential';

				return (
					<div
						key={provider.id}
						className={cn(
							'flex items-center justify-between rounded-xl border p-4 transition-all duration-200',
							connected
								? `${provider.borderColor} bg-card/50 backdrop-blur-sm`
								: 'border-border/30 bg-muted/20',
						)}
					>
						<div className="flex items-center gap-3">
							<div
								className={cn(
									'flex size-10 items-center justify-center rounded-lg border',
									provider.bgColor,
									provider.borderColor,
								)}
							>
								<Icon className={cn('size-5', provider.color)} />
							</div>
							<div className="space-y-0.5">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-foreground">
										{provider.name}
									</span>
									{connected && (
										<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
											<IconShieldCheck className="size-3" />
											Connected
										</span>
									)}
								</div>
								<p className="text-xs text-muted-foreground">
									{connected
										? isCredential
											? 'Password-based login enabled'
											: `Linked via ${provider.name}`
										: `Connect your ${provider.name} account`}
								</p>
							</div>
						</div>

						{!isCredential && (
							<Button
								type="button"
								variant={connected ? 'ghost' : 'outline'}
								size="sm"
								disabled={isActionLoading}
								onClick={() =>
									connected
										? handleUnlink(provider.id)
										: handleLink(provider.id)
								}
								className={cn(
									connected &&
										'text-muted-foreground hover:text-destructive',
								)}
							>
								{isActionLoading ? (
									<IconLoader2 className="size-3.5 animate-spin" />
								) : connected ? (
									<>
										<IconLinkOff className="size-3.5" />
										<span>Unlink</span>
									</>
								) : (
									<>
										<IconLink className="size-3.5" />
										<span>Connect</span>
									</>
								)}
							</Button>
						)}
					</div>
				);
			})}
		</div>
	);
};

/* ── Skeleton ── */

const ConnectedAccountsSkeleton = () => (
	<div className="space-y-3">
		{[1, 2].map((i) => (
			<div
				key={i}
				className="flex items-center justify-between rounded-xl border border-border/30 p-4"
			>
				<div className="flex items-center gap-3">
					<Skeleton className="size-10 rounded-lg" />
					<div className="space-y-1.5">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-3 w-36" />
					</div>
				</div>
				<Skeleton className="h-7 w-20 rounded-lg" />
			</div>
		))}
	</div>
);

export default ConnectedAccounts;
