import React from 'react';
import SettingsSidebar from '@/features/settings/components/settings-sidebar';

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-full w-full">
			{/* Settings sidebar */}
			<aside className="sticky top-0 h-screen shrink-0 overflow-y-auto border-r border-border/40 py-6 pl-4 pr-2">
				<SettingsSidebar />
			</aside>

			{/* Main content area */}
			<main className="flex-1 overflow-y-auto">
				<div className="mx-auto w-full px-8 py-8">{children}</div>
			</main>
		</div>
	);
}
