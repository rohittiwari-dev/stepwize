'use client';

import {
	IconSitemap,
	IconPlugConnected,
	IconSparkles,
	IconActivity,
	IconServer,
	IconGitBranch,
} from '@tabler/icons-react';
import { Reveal } from './reveal';

const FEATURES = [
	{
		icon: IconSitemap,
		title: 'Visual builder',
		description:
			'Drag, drop, and branch your logic on an infinite canvas — loops, conditions, and all, with zero code.',
	},
	{
		icon: IconPlugConnected,
		title: '200+ integrations',
		description:
			'Connect the APIs, databases, and tools your team already lives in, with secure prebuilt nodes.',
	},
	{
		icon: IconSparkles,
		title: 'AI-native nodes',
		description:
			'Drop LLM steps into any flow to classify, extract, summarize, and generate — inline.',
	},
	{
		icon: IconActivity,
		title: 'Real-time observability',
		description:
			'Trace every run with structured logs, automatic retries, and live execution metrics.',
	},
	{
		icon: IconServer,
		title: 'Self-hostable',
		description:
			'Fully open source and yours to run anywhere. Your data and credentials never leave your stack.',
	},
	{
		icon: IconGitBranch,
		title: 'Version control',
		description:
			'Branch, review, and roll back automations like real software — no more brittle, one-off scripts.',
	},
] as const;

export const LandingFeatures = () => {
	return (
		<section id="features" className="relative scroll-mt-20 py-24 sm:py-32">
			<div className="mx-auto max-w-6xl px-6 sm:px-8">
				<Reveal className="mx-auto max-w-2xl text-center">
					<span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
						Features
					</span>
					<h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
						Everything you need to automate
					</h2>
					<p className="mt-4 text-pretty text-muted-foreground">
						A complete toolkit for building, running, and scaling
						automations — from a quick personal task to mission-critical
						pipelines.
					</p>
				</Reveal>

				<div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
					{FEATURES.map((feature, i) => {
						const Icon = feature.icon;
						return (
							<Reveal key={feature.title} delay={(i % 3) * 0.08} y={20}>
								<div className="group">
									<span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
										<Icon className="size-5.5" />
									</span>
									<h3 className="mt-5 text-base font-semibold tracking-tight">
										{feature.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
										{feature.description}
									</p>
								</div>
							</Reveal>
						);
					})}
				</div>
			</div>
		</section>
	);
};
