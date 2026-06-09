'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
	IconArrowRight,
	IconBrandGithub,
	IconStarFilled,
	IconWebhook,
	IconSparkles,
	IconBrandSlack,
	IconDatabase,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { EASE } from './reveal';

/* ── Workflow diagram (fixed coordinate space → wires never drift) ── */

const NODES = [
	{ id: 'trigger', cx: 80, cy: 130, icon: IconWebhook, label: 'Webhook', sub: 'Trigger' },
	{ id: 'agent', cx: 300, cy: 130, icon: IconSparkles, label: 'AI Agent', sub: 'Classify intent' },
	{ id: 'slack', cx: 560, cy: 70, icon: IconBrandSlack, label: 'Slack', sub: 'Notify team' },
	{ id: 'db', cx: 560, cy: 190, icon: IconDatabase, label: 'Database', sub: 'Insert row' },
] as const;

const NODE_W = 150;
const NODE_H = 56;

const EDGES = [
	'M155 130 L225 130',
	'M375 130 C430 130 430 70 485 70',
	'M375 130 C430 130 430 190 485 190',
] as const;

const PORTS = [
	[155, 130], [225, 130], [375, 130], [485, 70], [485, 190],
] as const;

const WorkflowDiagram = () => {
	const reduce = useReducedMotion();

	return (
		<div className="relative mx-auto flex h-[180px] w-full max-w-[680px] items-center justify-center overflow-hidden sm:h-[220px] md:h-[260px] lg:h-[300px]">
			{/* soft glow */}
			<div className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

			<div
				className="relative origin-center scale-[0.46] sm:scale-[0.62] md:scale-[0.8] lg:scale-100"
				style={{ width: 660, height: 260 }}
				aria-hidden
			>
				<svg
					className="absolute inset-0 overflow-visible"
					width={660}
					height={260}
					viewBox="0 0 660 260"
					fill="none"
				>
					{EDGES.map((d, i) => (
						<g key={i}>
							<motion.path
								d={d}
								stroke="var(--color-muted-foreground)"
								strokeOpacity={0.25}
								strokeWidth={2}
								strokeLinecap="round"
								initial={reduce ? false : { pathLength: 0 }}
								whileInView={{ pathLength: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
							/>
							{!reduce && (
								<motion.path
									d={d}
									stroke="var(--color-primary)"
									strokeWidth={2.5}
									strokeLinecap="round"
									strokeDasharray="1 9"
									initial={{ pathLength: 0, strokeDashoffset: 0 }}
									whileInView={{ pathLength: 1, strokeDashoffset: [0, -20] }}
									viewport={{ once: true }}
									transition={{
										pathLength: { duration: 0.8, delay: 0.3 + i * 0.15 },
										strokeDashoffset: {
											duration: 1.3,
											repeat: Infinity,
											ease: 'linear',
											delay: 1 + i * 0.2,
										},
									}}
								/>
							)}
						</g>
					))}
					{PORTS.map(([x, y], i) => (
						<circle
							key={i}
							cx={x}
							cy={y}
							r={3}
							fill="var(--color-background)"
							stroke="var(--color-primary)"
							strokeOpacity={0.5}
							strokeWidth={1.5}
						/>
					))}
				</svg>

				{NODES.map((node, i) => {
					const Icon = node.icon;
					return (
						<motion.div
							key={node.id}
							className="absolute"
							style={{
								left: node.cx - NODE_W / 2,
								top: node.cy - NODE_H / 2,
								width: NODE_W,
								height: NODE_H,
							}}
							initial={reduce ? false : { opacity: 0, scale: 0.9, y: 6 }}
							whileInView={{ opacity: 1, scale: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: EASE }}
						>
							<div className="flex h-full items-center gap-3 rounded-xl border border-border bg-card px-3.5 shadow-sm">
								<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<Icon className="size-5" />
								</span>
								<span className="min-w-0 leading-tight">
									<span className="block truncate text-sm font-semibold text-foreground">
										{node.label}
									</span>
									<span className="block truncate text-xs text-muted-foreground">
										{node.sub}
									</span>
								</span>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* fade into page */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-background to-transparent" />
		</div>
	);
};

export const LandingHero = () => {
	const reduce = useReducedMotion();

	const container: Variants = {
		hidden: {},
		show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
	};
	const item: Variants = {
		hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
		show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
	};

	return (
		<section className="relative overflow-hidden">
			{/* ── Background: faint grid + top glow (in-palette) ── */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: [
							'linear-gradient(to right, oklch(0.45 0 0 / 7%) 1px, transparent 1px)',
							'linear-gradient(to bottom, oklch(0.45 0 0 / 7%) 1px, transparent 1px)',
						].join(', '),
						backgroundSize: '48px 48px',
						maskImage:
							'radial-gradient(120% 90% at 50% 0%, black, transparent 70%)',
						WebkitMaskImage:
							'radial-gradient(120% 90% at 50% 0%, black, transparent 70%)',
					}}
				/>
				<div className="absolute left-1/2 top-[-20%] h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
			</div>

			<div className="mx-auto max-w-6xl px-6 pb-12 pt-20 text-center sm:px-8 sm:pt-28">
				<motion.div variants={container} initial="hidden" animate="show">
					{/* eyebrow */}
					<motion.div variants={item} className="flex justify-center">
						<Link
							href="#features"
							className="group inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 py-1 pl-1.5 pr-3 text-xs backdrop-blur-sm transition-colors hover:bg-muted"
						>
							<span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
								New
							</span>
							<span className="font-medium text-muted-foreground">
								AI-native nodes are here
							</span>
							<IconArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
						</Link>
					</motion.div>

					{/* headline */}
					<motion.h1
						variants={item}
						className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
					>
						Automate the busywork.
						<br />
						<span className="text-primary">Build what matters.</span>
					</motion.h1>

					{/* subcopy */}
					<motion.p
						variants={item}
						className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
					>
						Stepwize is the open-source workflow builder for connecting
						your APIs, scheduling jobs, and orchestrating your entire
						stack — visually, with no code.
					</motion.p>

					{/* CTAs */}
					<motion.div
						variants={item}
						className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
					>
						<Button
							size="lg"
							className="group h-11 px-5"
							nativeButton={false}
							render={<Link href="/sign-up" />}
						>
							Start building free
							<IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="h-11 px-5"
							nativeButton={false}
							render={<Link href="#" />}
						>
							<IconBrandGithub className="size-4" />
							Star on GitHub
							<span className="ml-1 flex items-center gap-1 text-muted-foreground">
								<IconStarFilled className="size-3" />
								2.4k
							</span>
						</Button>
					</motion.div>

					{/* trust */}
					<motion.p
						variants={item}
						className="mt-5 text-xs text-muted-foreground"
					>
						No credit card required · Open source · Self-hostable
					</motion.p>
				</motion.div>

				{/* diagram */}
				<motion.div
					initial={reduce ? false : { opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
					className="mt-14"
				>
					<WorkflowDiagram />
				</motion.div>
			</div>
		</section>
	);
};
