'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
	IconPlug, 
	IconSitemap, 
	IconRocket, 
	IconCircleCheck, 
	IconLoader,
	IconSettings,
	IconRefresh,
} from '@tabler/icons-react';
import { Reveal } from './reveal';

const STEPS = [
	{
		num: '01',
		title: 'Connect',
		description:
			'Link your apps, APIs, and databases with secure, prebuilt integrations — in a click.',
		icon: IconPlug,
	},
	{
		num: '02',
		title: 'Build',
		description:
			'Map your logic visually on the canvas: triggers, branches, AI steps, and loops.',
		icon: IconSitemap,
	},
	{
		num: '03',
		title: 'Automate',
		description:
			'Ship it. Stepwize runs on schedule or on trigger, and reports back on every execution.',
		icon: IconRocket,
	},
] as const;

export const LandingSteps = () => {
	const [activeStep, setActiveStep] = useState<number>(0);
	const reduce = useReducedMotion();

	return (
		<section
			id="how-it-works"
			className="scroll-mt-20 border-y border-border/60 bg-muted/20 py-24 sm:py-32"
		>
			<div className="mx-auto max-w-6xl px-6 sm:px-8">
				<Reveal className="max-w-2xl">
					<span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
						How it works
					</span>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl bg-linear-to-b from-foreground via-foreground/95 to-foreground/80 bg-clip-text text-transparent">
						From idea to automation in minutes
					</h2>
				</Reveal>

				<div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">
					{/* Left Column: Interactive Steps List */}
					<div className="lg:col-span-5 flex flex-col gap-4">
						{STEPS.map((step, i) => {
							const Icon = step.icon;
							const isActive = activeStep === i;
							return (
								<div
									key={step.num}
									onClick={() => setActiveStep(i)}
									className={cn(
										"group cursor-pointer rounded-2xl border p-5 transition-all duration-300",
										isActive
											? "border-primary/20 bg-card shadow-sm shadow-primary/5"
											: "border-transparent hover:bg-card/45 hover:border-border/60"
									)}
								>
									<div className="flex items-center gap-4">
										<span className={cn(
											"font-mono text-2xl font-bold tracking-tight transition-colors",
											isActive ? "text-primary" : "text-muted-foreground/45 group-hover:text-muted-foreground/75"
										)}>
											{step.num}
										</span>
										<span className={cn(
											"flex size-9 items-center justify-center rounded-lg border transition-all duration-300",
											isActive 
												? "bg-primary/10 border-primary/20 text-primary" 
												: "bg-background border-border text-muted-foreground group-hover:text-foreground"
										)}>
											<Icon className="size-4.5" />
										</span>
										<h3 className={cn(
											"text-lg font-bold tracking-tight transition-colors",
											isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
										)}>
											{step.title}
										</h3>
									</div>
									<p className="mt-3 pl-10 text-sm leading-relaxed text-muted-foreground/90">
										{step.description}
									</p>
								</div>
							);
						})}
					</div>

					{/* Right Column: Dynamic Mockup Container */}
					<div className="lg:col-span-7">
						<div className="relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border/65 bg-card/50 p-6 shadow-md backdrop-blur-xs">
							{/* Backdrop Grid Pattern */}
							<div 
								className="absolute inset-0 opacity-[0.25]"
								style={{
									backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
									backgroundSize: '16px 16px',
								}}
							/>
							<div className="absolute inset-0 bg-radial-at-c from-primary/5 via-transparent to-transparent" />

							<AnimatePresence mode="wait">
								{activeStep === 0 && (
									<motion.div
										key="connect-mockup"
										initial={reduce ? false : { opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.35 }}
										className="relative flex items-center justify-center gap-6"
									>
										{/* Sliding connected bubble cards */}
										<div className="flex flex-col gap-3">
											<div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2.5 shadow-xs">
												<span className="size-2 rounded-full bg-emerald-500" />
												<span className="text-xs font-semibold">PostgreSQL Database</span>
											</div>
											<div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-background p-2.5 shadow-xs">
												<span className="size-2 rounded-full bg-primary" />
												<span className="text-xs font-semibold">Slack Workspace</span>
											</div>
										</div>
										
										{/* Connection hub icon */}
										<div className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-lg shadow-primary/10">
											<IconPlug className="size-7 animate-pulse" />
										</div>
									</motion.div>
								)}

								{activeStep === 1 && (
									<motion.div
										key="build-mockup"
										initial={reduce ? false : { opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.35 }}
										className="relative flex flex-col gap-4 w-full max-w-[280px]"
									>
										{/* Mini designer diagram nodes */}
										<div className="flex items-center justify-between rounded-xl border border-border bg-background/80 p-3 shadow-xs">
											<div className="flex items-center gap-2">
												<span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
													<IconSettings className="size-4" />
												</span>
												<span className="text-xs font-bold">1. Read Row</span>
											</div>
											<span className="text-[10px] font-bold text-muted-foreground uppercase">Query</span>
										</div>

										<div className="mx-auto h-6 w-0.5 border-l-2 border-dashed border-border" />

										<div className="flex items-center justify-between rounded-xl border border-primary/30 bg-background p-3 shadow-xs">
											<div className="flex items-center gap-2">
												<span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
													<IconRefresh className="size-4" />
												</span>
												<span className="text-xs font-bold">2. Transform AI</span>
											</div>
											<span className="text-[10px] font-bold text-primary uppercase">Active</span>
										</div>
									</motion.div>
								)}

								{activeStep === 2 && (
									<motion.div
										key="automate-mockup"
										initial={reduce ? false : { opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.35 }}
										className="relative flex flex-col gap-2 w-full max-w-[320px] font-mono text-[11px]"
									>
										<div className="flex items-center justify-between border-b border-border/50 pb-2 text-[10px] text-muted-foreground font-bold">
											<span>RUN HISTORY</span>
											<span className="text-emerald-500">ENGINE IDLE</span>
										</div>
										{/* History items */}
										<div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-2.5">
											<div className="flex items-center gap-2">
												<IconCircleCheck className="size-4.5 text-emerald-500" />
												<span className="font-bold text-foreground">Run #4982</span>
											</div>
											<span className="text-muted-foreground">Success (280ms)</span>
										</div>
										<div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-2.5">
											<div className="flex items-center gap-2">
												<IconCircleCheck className="size-4.5 text-emerald-500" />
												<span className="font-bold text-foreground">Run #4981</span>
											</div>
											<span className="text-muted-foreground">Success (245ms)</span>
										</div>
										<div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-2.5 opacity-60">
											<div className="flex items-center gap-2">
												<IconCircleCheck className="size-4.5 text-emerald-500" />
												<span className="font-bold text-foreground">Run #4980</span>
											</div>
											<span className="text-muted-foreground">Success (312ms)</span>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
