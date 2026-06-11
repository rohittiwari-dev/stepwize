import { IconBuilding } from '@tabler/icons-react';
import WorkspaceForm from '@/features/settings/components/workspace-form';
import WorkspaceDangerZone from '@/features/settings/components/workspace-danger-zone';

export default function WorkspaceSettingsPage() {
	return (
		<div className="space-y-10">
			{/* Page Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
						<IconBuilding className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-foreground">
							Workspace
						</h1>
						<p className="text-sm text-muted-foreground">
							Configure your workspace name, URL, and general settings
						</p>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="h-px bg-border/50" />

			{/* General Section */}
			<section className="space-y-5">
				<div>
					<h2 className="text-sm font-semibold text-foreground/90">
						General
					</h2>
					<p className="text-xs text-muted-foreground">
						Update your workspace name and URL
					</p>
				</div>
				<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
					<WorkspaceForm />
				</div>
			</section>

			{/* Danger Zone */}
			<section className="space-y-5">
				<div>
					<h2 className="text-sm font-semibold text-destructive/80">
						Danger Zone
					</h2>
					<p className="text-xs text-muted-foreground">
						Irreversible actions that affect your entire workspace
					</p>
				</div>
				<WorkspaceDangerZone />
			</section>
		</div>
	);
}
