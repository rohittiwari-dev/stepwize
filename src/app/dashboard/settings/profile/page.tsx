import { IconUser } from '@tabler/icons-react';
import ProfileForm from '@/features/settings/components/profile-form';
import ConnectedAccounts from '@/features/settings/components/connected-accounts';

export default function ProfileSettingsPage() {
	return (
		<div className="space-y-5">
			{/* Page Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
						<IconUser className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-foreground">
							Profile
						</h1>
						<p className="text-sm text-muted-foreground">
							Manage your personal details and connected accounts
						</p>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="h-px bg-border/50" />

			{/* Personal Details Section */}
			<section className="space-y-5 ">
				<div>
					<h2 className="text-sm font-semibold text-foreground/90">
						Personal Details
					</h2>
					<p className="text-xs text-muted-foreground">
						Update your display name and avatar
					</p>
				</div>
				<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
					<ProfileForm />
				</div>
			</section>

			{/* Connected Accounts Section */}
			<section className="space-y-5">
				<div>
					<h2 className="text-sm font-semibold text-foreground/90">
						Connected Accounts
					</h2>
					<p className="text-xs text-muted-foreground">
						Manage your authentication methods and linked providers
					</p>
				</div>
				<ConnectedAccounts />
			</section>
		</div>
	);
}
