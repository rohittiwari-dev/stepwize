import { IconPlug } from '@tabler/icons-react';

export default function ConnectorsSettingsPage() {
	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
						<IconPlug className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-foreground">
							Connectors
						</h1>
						<p className="text-sm text-muted-foreground">
							Connect and manage third-party apps and services
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
						Connected Apps
					</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							View and manage your connected third-party services. Disconnect or
							re-authenticate integrations.
						</p>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-sm font-medium text-foreground/80">
						Available Integrations
					</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							Browse and connect new integrations to expand your workflow
							capabilities.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
