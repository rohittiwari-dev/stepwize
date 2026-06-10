'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { IconProps } from '@tabler/icons-react';

type NavItem = {
	title: string;
	url: string;
	icon?: React.ComponentType<IconProps>;
	matchSubPaths?: boolean;
	children?: Omit<NavItem, 'children' | 'icon'>[];
};

type SidebarNavGroup = {
	label: string;
	items: NavItem[];
};

function isRouteActive(
	pathname: string,
	url: string,
	matchSubPaths = false,
): boolean {
	if (matchSubPaths) {
		return pathname === url || pathname.startsWith(`${url}/`);
	}
	return pathname === url;
}

const SidebarNavItem = ({
	item,
	pathname,
}: {
	item: NavItem;
	pathname: string;
}) => {
	const Icon = item.icon;
	const active = isRouteActive(pathname, item.url, item.matchSubPaths);

	return (
		<SidebarMenuItem className="text-neutral-800 hover:text-primary!">
			<SidebarMenuButton
				isActive={active}
				tooltip={item.title}
				render={<Link href={item.url} />}
			>
				{Icon && <Icon className="size-4 shrink-0" />}
				<span>{item.title}</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

const SidebarNavItems = ({ groups }: { groups: SidebarNavGroup[] }) => {
	const pathname = usePathname();

	return (
		<>
			{groups.map((group) => (
				<SidebarGroup key={group.label}>
					<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
					<SidebarContent>
						<SidebarMenu className="gap-1">
							{group.items.map((item) => (
								<SidebarNavItem
									key={item.title}
									item={item}
									pathname={pathname}
								/>
							))}
						</SidebarMenu>
					</SidebarContent>
				</SidebarGroup>
			))}
		</>
	);
};

export default SidebarNavItems;
export type { NavItem, SidebarNavGroup };
