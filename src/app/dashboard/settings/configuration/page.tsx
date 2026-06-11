import { IconSettings } from '@tabler/icons-react';

export default function ConfigurationSettingsPage() {
	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
						<IconSettings className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-foreground">
							Configuration
						</h1>
						<p className="text-sm text-muted-foreground">
							Set workflow defaults, retry policies, and app-wide configuration
						</p>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="h-px bg-border/50" />

			{/* Content placeholder */}
			<div className="space-y-6">
				<section className="space-y-4">
					<h2 className="text-sm font-medium text-foreground/80">
						Workflow Defaults
					</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							Configure default timeout, retry count, and error handling for
							new workflows.
						</p>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-sm font-medium text-foreground/80">
						Application
					</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							General application settings including notification preferences
							and data retention policies.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
