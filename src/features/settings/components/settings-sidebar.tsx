'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
	IconUser,
	IconBuilding,
	IconUsers,
	IconCreditCard,
	IconShield,
	IconSettings,
	IconPlug,
	IconPalette,
	IconChevronRight,
} from '@tabler/icons-react';
import { motion } from 'motion/react';

type SettingsNavItem = {
	title: string;
	description: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
};

const SETTINGS_NAV: SettingsNavItem[] = [
	{
		title: 'Profile',
		description: 'Personal details & accounts',
		href: '/dashboard/settings/profile',
		icon: IconUser,
	},
	{
		title: 'Workspace',
		description: 'Name, slug & defaults',
		href: '/dashboard/settings/workspace',
		icon: IconBuilding,
	},
	{
		title: 'Teams & Members',
		description: 'Roles & invitations',
		href: '/dashboard/settings/members',
		icon: IconUsers,
	},
	{
		title: 'Billing',
		description: 'Subscription & invoices',
		href: '/dashboard/settings/billing',
		icon: IconCreditCard,
	},
	{
		title: 'Security',
		description: '2FA, sessions & password',
		href: '/dashboard/settings/security',
		icon: IconShield,
	},
	{
		title: 'Configuration',
		description: 'Workflow & app defaults',
		href: '/dashboard/settings/configuration',
		icon: IconSettings,
	},
	{
		title: 'Connectors',
		description: 'Third-party integrations',
		href: '/dashboard/settings/connectors',
		icon: IconPlug,
	},
	{
		title: 'Appearance',
		description: 'Theme & UI preferences',
		href: '/dashboard/settings/appearance',
		icon: IconPalette,
	},
];

const SettingsSidebar = () => {
	const pathname = usePathname();

	return (
		<nav className="flex w-[260px] shrink-0 flex-col gap-1 pr-1">
			<div className="mb-3 px-3">
				<h2 className="text-sm font-semibold text-foreground/90">Settings</h2>
				<p className="text-xs text-muted-foreground">
					Manage your workspace
				</p>
			</div>

			{SETTINGS_NAV.map((item) => {
				const isActive =
					pathname === item.href ||
					pathname.startsWith(`${item.href}/`);
				const Icon = item.icon;

				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
							isActive
								? 'text-foreground'
								: 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
						)}
					>
						{/* Active indicator pill */}
						{isActive && (
							<motion.div
								layoutId="settings-active-indicator"
								className="absolute inset-0 rounded-lg border border-border/60 bg-accent/70 shadow-sm"
								transition={{
									type: 'spring',
									stiffness: 380,
									damping: 30,
								}}
							/>
						)}

						<div
							className={cn(
								'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors duration-200',
								isActive
									? 'border-primary/30 bg-primary/10 text-primary'
									: 'border-border/50 bg-muted/50 text-muted-foreground group-hover:border-border group-hover:text-foreground',
							)}
						>
							<Icon className="size-4" />
						</div>

						<div className="relative z-10 flex flex-1 flex-col gap-0.5">
							<span
								className={cn(
									'text-[13px] font-medium leading-tight',
									isActive && 'text-foreground',
								)}
							>
								{item.title}
							</span>
							<span className="text-[11px] leading-tight text-muted-foreground">
								{item.description}
							</span>
						</div>

						<IconChevronRight
							className={cn(
								'relative z-10 size-3.5 shrink-0 transition-all duration-200',
								isActive
									? 'text-primary opacity-100'
									: 'opacity-0 group-hover:opacity-60',
							)}
						/>
					</Link>
				);
			})}
		</nav>
	);
};

export default SettingsSidebar;
