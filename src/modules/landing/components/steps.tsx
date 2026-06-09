'use client';

import { cn } from '@/lib/utils';
import { Reveal } from './reveal';

const STEPS = [
	{
		num: '01',
		title: 'Connect',
		description:
			'Link your apps, APIs, and databases with secure, prebuilt integrations — in a click.',
	},
	{
		num: '02',
		title: 'Build',
		description:
			'Map your logic visually on the canvas: triggers, branches, AI steps, and loops.',
	},
	{
		num: '03',
		title: 'Automate',
		description:
			'Ship it. Stepwize runs on schedule or on trigger, and reports back on every execution.',
	},
] as const;

export const LandingSteps = () => {
	return (
		<section
			id="how-it-works"
			className="scroll-mt-20 border-y border-border/60 bg-muted/30 py-24 sm:py-32"
		>
			<div className="mx-auto max-w-6xl px-6 sm:px-8">
				<Reveal className="max-w-2xl">
					<span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
						How it works
					</span>
					<h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
						From idea to automation in minutes
					</h2>
				</Reveal>

				<div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-8">
					{STEPS.map((step, i) => (
						<Reveal key={step.num} delay={i * 0.1}>
							<div
								className={cn(
									i > 0 && 'lg:border-l lg:border-border/60 lg:pl-8',
								)}
							>
								<span className="font-mono text-5xl font-semibold tracking-tight text-primary/25">
									{step.num}
								</span>
								<h3 className="mt-5 text-xl font-semibold tracking-tight">
									{step.title}
								</h3>
								<p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
									{step.description}
								</p>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
};
