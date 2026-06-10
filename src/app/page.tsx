import { LandingNavbar } from '@/features/landing/components/navbar';
import { LandingHero } from '@/features/landing/components/hero';
import { LandingFeatures } from '@/features/landing/components/features';
import { LandingSteps } from '@/features/landing/components/steps';
import { LandingCta } from '@/features/landing/components/cta';
import { LandingFooter } from '@/features/landing/components/footer';
import { Reveal } from '@/features/landing/components/reveal';
import { LandingIntegrations } from '@/features/landing/components/integrations';
import { BackgroundGrid } from '@/components/ui/background-grid';
import LightPillar from '@/components/ui/light-pillar';

const LOGOS = [
	{ name: 'Acme', icon: '✦' },
	{ name: 'Globex', icon: '⚛' },
	{ name: 'Initech', icon: '❖' },
	{ name: 'Umbrella', icon: '▲' },
	{ name: 'Hooli', icon: '♾' },
	{ name: 'Northwind', icon: '◈' },
];

const LogoCloud = () => (
	<section className="border-y border-border/60 bg-muted/10 py-10">
		<div className="mx-auto max-w-6xl px-6 sm:px-8">
			<Reveal>
				<p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
					Trusted by fast-moving teams
				</p>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
					{LOGOS.map((logo) => (
						<div
							key={logo.name}
							className="group flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-4 py-1.5 text-sm font-semibold tracking-tight text-muted-foreground/75 shadow-xs transition-all duration-300 hover:border-primary/20 hover:bg-background/85 hover:text-foreground hover:shadow-sm"
						>
							<span className="text-primary/70 transition-transform group-hover:scale-110 group-hover:text-primary">
								{logo.icon}
							</span>
							<span>{logo.name}</span>
						</div>
					))}
				</div>
			</Reveal>
		</div>
	</section>
);

export default function Home() {
	return (
		<>
			<BackgroundGrid />
			<LandingNavbar />
			<main>
				<LandingHero />
				<LogoCloud />
				<LandingFeatures />
				<LandingIntegrations />
				<LandingSteps />
				<LandingCta />
			</main>
			<LandingFooter />
		</>
	);
}
