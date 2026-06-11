import { IconUsers } from '@tabler/icons-react';
import { TeamsAndMembers } from '@/features/settings/components/teams-and-members';

export default function MembersSettingsPage() {
	return (
		<div className="space-y-5">
			{/* Page Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
						<IconUsers className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-foreground">
							Teams & Members
						</h1>
						<p className="text-sm text-muted-foreground">
							Manage your workspace members, teams, and
							invitations
						</p>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="h-px bg-border/50" />

			{/* Teams and Members */}
			<TeamsAndMembers />
		</div>
	);
}
