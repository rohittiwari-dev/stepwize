'use client';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut, useSession } from '@/lib/auth/clients';
import {
	IconBell,
	IconCreditCard,
	IconLogout,
	IconSelector,
	IconShieldCheck,
	IconSparkles,
} from '@tabler/icons-react';

function getInitials(name: string): string {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

const UserControl = () => {
	const { isMobile } = useSidebar();
	const { data: session, isPending } = useSession();
	const router = useRouter();

	if (isPending) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" className="pointer-events-none">
						<Skeleton className="h-8 w-8 rounded-lg bg-muted-foreground/15 dark:bg-muted" />
						<div className="grid flex-1 gap-1.5 text-left">
							<Skeleton className="h-4 w-24 bg-muted-foreground/15 dark:bg-muted" />
							<Skeleton className="h-3 w-32 bg-muted-foreground/15 dark:bg-muted" />
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	const user = session?.user;

	if (!user) {
		return null;
	}

	const initials = getInitials(user.name ?? 'U');

	const handleSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => router.push('/sign-in'),
			},
		});
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
							/>
						}
					>
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage
								src={user.image ?? undefined}
								alt={user.name ?? ''}
								referrerPolicy="no-referrer"
							/>
							<AvatarFallback className="rounded-lg">
								{initials}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">
								{user.name}
							</span>
							<span className="truncate text-xs text-muted-foreground">
								{user.email}
							</span>
						</div>
						<IconSelector className="ml-auto size-4" />
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={user.image ?? undefined}
											alt={user.name ?? ''}
											referrerPolicy="no-referrer"
										/>
										<AvatarFallback className="rounded-lg">
											{initials}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{user.name}
										</span>
										<span className="truncate text-xs text-muted-foreground">
											{user.email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<IconSparkles className="size-4" />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<IconShieldCheck className="size-4" />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconCreditCard className="size-4" />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconBell className="size-4" />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={handleSignOut}>
							<IconLogout className="size-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};

export default UserControl;
