import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/features/workspace/components/sidebar';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import React from 'react';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect('/sign-in');
	}

	let membership = null;
	try {
		membership = await prisma.member.findFirst({
			where: { userId: session.user.id },
		});
	} catch {
		redirect('/get-started');
	}

	if (!membership) {
		redirect('/get-started');
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
