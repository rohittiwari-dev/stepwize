import { IconShield } from '@tabler/icons-react';

export default function SecuritySettingsPage() {
	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
						<IconShield className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-foreground">
							Security
						</h1>
						<p className="text-sm text-muted-foreground">
							Protect your account with 2FA, manage sessions, and update your
							password
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
						Two-Factor Authentication
					</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							Enable 2FA via authenticator app or SMS for an extra layer of
							security on your account.
						</p>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-sm font-medium text-foreground/80">
						Active Sessions
					</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							Review and revoke active sessions across your devices and
							browsers.
						</p>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-sm font-medium text-foreground/80">
						Password
					</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							Change your password or set up a passkey for passwordless
							authentication.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
