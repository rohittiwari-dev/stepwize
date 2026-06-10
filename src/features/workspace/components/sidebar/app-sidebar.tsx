'use client';
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar';
import React from 'react';
import SidebarHeader from './sidebar-header';
import SidebarNavItems, { type SidebarNavGroup } from './sidebar-nav-items';
import {
	IconLayoutDashboard,
	IconRoute,
	IconHistory,
	IconCertificate,
} from '@tabler/icons-react';
import SidebarFooter from './sidebar-footer';
import SidebarBanner from './sidebar-banner';

const NAV_GROUPS: SidebarNavGroup[] = [
	{
		label: 'Workspace',
		items: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: IconLayoutDashboard,
			},
			{
				title: 'Workflows',
				url: '/dashboard/workflows',
				icon: IconRoute,
				matchSubPaths: true,
			},
			{
				title: 'Credentials',
				url: '/dashboard/credentials',
				icon: IconCertificate,
				matchSubPaths: true,
			},
			{
				title: 'History',
				url: '/dashboard/history',
				icon: IconHistory,
				matchSubPaths: true,
			},
		],
	},
];

const AppSidebar = () => {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader />
			<SidebarContent>
				<SidebarNavItems groups={NAV_GROUPS} />
			</SidebarContent>
			<SidebarBanner />
			<SidebarFooter />
			<SidebarRail />
		</Sidebar>
	);
};

export default AppSidebar;
