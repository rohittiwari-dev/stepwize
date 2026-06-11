import { IconCreditCard } from '@tabler/icons-react';

export default function BillingSettingsPage() {
	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
						<IconCreditCard className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-foreground">
							Billing
						</h1>
						<p className="text-sm text-muted-foreground">
							Manage your subscription plan, payment methods, and invoices
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
						Current Plan
					</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							View your current subscription tier, usage limits, and upgrade
							options.
						</p>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-sm font-medium text-foreground/80">
						Invoices
					</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							Download past invoices and view billing history.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
