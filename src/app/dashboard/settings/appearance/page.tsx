import { IconPalette } from '@tabler/icons-react';

export default function AppearanceSettingsPage() {
	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
						<IconPalette className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-foreground">
							Appearance
						</h1>
						<p className="text-sm text-muted-foreground">
							Customize the theme, colors, and UI preferences
						</p>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="h-px bg-border/50" />

			{/* Content placeholder */}
			<div className="space-y-6">
				<section className="space-y-4">
					<h2 className="text-sm font-medium text-foreground/80">Theme</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							Choose between light, dark, and system theme modes. Your
							preference is saved per device.
						</p>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-sm font-medium text-foreground/80">
						UI Preferences
					</h2>
					<div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
						<p className="text-sm text-muted-foreground">
							Adjust sidebar density, animation speed, and code editor font
							settings.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
