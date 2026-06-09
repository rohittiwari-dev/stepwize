import { LandingNavbar } from '@/modules/landing/components/navbar';
import { LandingHero } from '@/modules/landing/components/hero';
import { LandingFeatures } from '@/modules/landing/components/features';
import { LandingSteps } from '@/modules/landing/components/steps';
import { LandingCta } from '@/modules/landing/components/cta';
import { LandingFooter } from '@/modules/landing/components/footer';
import { Reveal } from '@/modules/landing/components/reveal';

const LOGOS = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Northwind'];

const LogoCloud = () => (
	<section className="border-y border-border/60 py-10">
		<div className="mx-auto max-w-6xl px-6 sm:px-8">
			<Reveal>
				<p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
					Trusted by fast-moving teams
				</p>
				<div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
					{LOGOS.map((logo) => (
						<span
							key={logo}
							className="text-lg font-semibold tracking-tight text-muted-foreground/55 transition-colors hover:text-muted-foreground"
						>
							{logo}
						</span>
					))}
				</div>
			</Reveal>
		</div>
	</section>
);

export default function Home() {
	return (
		<>
			<LandingNavbar />
			<main>
				<LandingHero />
				<LogoCloud />
				<LandingFeatures />
				<LandingSteps />
				<LandingCta />
			</main>
			<LandingFooter />
		</>
	);
}
