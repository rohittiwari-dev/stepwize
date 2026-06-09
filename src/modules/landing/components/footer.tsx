import Link from 'next/link';
import {
	IconBolt,
	IconBrandGithub,
	IconBrandX,
	IconBrandDiscord,
} from '@tabler/icons-react';

const COLUMNS = [
	{
		heading: 'Product',
		links: ['Features', 'Integrations', 'Pricing', 'Changelog'],
	},
	{
		heading: 'Resources',
		links: ['Documentation', 'Guides', 'API reference', 'Status'],
	},
	{
		heading: 'Company',
		links: ['About', 'Blog', 'Careers', 'Contact'],
	},
] as const;

const SOCIALS = [
	{ icon: IconBrandGithub, label: 'GitHub' },
	{ icon: IconBrandX, label: 'X' },
	{ icon: IconBrandDiscord, label: 'Discord' },
] as const;

export const LandingFooter = () => {
	return (
		<footer className="border-t border-border/60">
			<div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
				<div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
					{/* Brand */}
					<div>
						<Link href="/" className="flex items-center gap-2.5">
							<span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<IconBolt className="size-4.5" />
							</span>
							<span className="text-lg font-bold tracking-tight">
								Stepwize
							</span>
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
							The open-source workflow automation platform your whole
							team can build on.
						</p>
						<div className="mt-6 flex items-center gap-2">
							{SOCIALS.map(({ icon: Icon, label }) => (
								<Link
									key={label}
									href="#"
									aria-label={label}
									className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								>
									<Icon className="size-4.5" />
								</Link>
							))}
						</div>
					</div>

					{/* Link columns */}
					{COLUMNS.map((col) => (
						<div key={col.heading}>
							<h3 className="text-sm font-semibold">{col.heading}</h3>
							<ul className="mt-4 space-y-3">
								{col.links.map((link) => (
									<li key={link}>
										<Link
											href="#"
											className="text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{link}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} Stepwize. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<Link
							href="/privacy"
							className="text-xs text-muted-foreground transition-colors hover:text-foreground"
						>
							Privacy
						</Link>
						<Link
							href="/terms"
							className="text-xs text-muted-foreground transition-colors hover:text-foreground"
						>
							Terms
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};
