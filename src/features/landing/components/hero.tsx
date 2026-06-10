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
import StarBorder from '@/components/ui/star-border';
import SpotlightCard from '@/components/ui/spotlight-card';
import ElectricBorder from '@/components/ui/electric-border';
import MagicRings from '@/components/ui/magic-rings';
import LightPillar from '@/components/ui/light-pillar';

/* ── Workflow diagram (fixed coordinate space → wires never drift) ── */

const NODES = [
	{
		id: 'trigger',
		cx: 80,
		cy: 130,
		icon: IconWebhook,
		label: 'Webhook',
		sub: 'Trigger',
		color: 'text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20 shadow-fuchsia-500/5',
		primary: false,
	},
	{
		id: 'agent',
		cx: 300,
		cy: 130,
		icon: IconSparkles,
		label: 'AI Agent',
		sub: 'Classify intent',
		color: 'text-violet-500 bg-violet-500/10 border-violet-500/20 shadow-neon shadow-violet-500/20',
		primary: true,
	},
	{
		id: 'slack',
		cx: 560,
		cy: 70,
		icon: IconBrandSlack,
		label: 'Slack',
		sub: 'Notify team',
		color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5',
		primary: false,
	},
	{
		id: 'db',
		cx: 560,
		cy: 190,
		icon: IconDatabase,
		label: 'Database',
		sub: 'Insert row',
		color: 'text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5',
		primary: false,
	},
] as const;

const NODE_W = 154;
const NODE_H = 58;

const EDGES = [
	'M157 130 L223 130',
	'M377 130 C432 130 432 70 483 70',
	'M377 130 C432 130 432 190 483 190',
] as const;

const PORTS = [
	[157, 130],
	[223, 130],
	[377, 130],
	[483, 70],
	[483, 190],
] as const;

const WorkflowDiagram = () => {
	const reduce = useReducedMotion();

	return (
		<div className="relative mx-auto flex h-[200px] w-full max-w-[720px] items-center justify-center overflow-hidden  p-4 sm:h-[240px] md:h-[280px] lg:h-[320px]">
			{/* Soft color glow */}

			<div
				className="relative origin-center scale-[0.46] sm:scale-[0.62] md:scale-[0.8] lg:scale-100"
				style={{ width: 660, height: 260 }}
				aria-hidden
			>
				{/* ── Magic Rings Background ── */}
				<div className="absolute inset-0 -z-10 scale-[1.4] opacity-50 blur-[2px]">
					<MagicRings
						color="#8B5CF6"
						colorTwo="#D946EF"
						ringCount={4}
						ringGap={2.5}
						baseRadius={0.2}
						followMouse={true}
						mouseInfluence={0.3}
						opacity={0.8}
					/>
				</div>

				<svg
					className="absolute inset-0 overflow-visible animate-pulse-subtle"
					width={660}
					height={260}
					viewBox="0 0 660 260"
					fill="none"
				>
					{EDGES.map((d, i) => (
						<g key={i}>
							{/* Connection shadows / base path */}
							<motion.path
								d={d}
								stroke="var(--color-border)"
								strokeOpacity={0.5}
								strokeWidth={2.5}
								strokeLinecap="round"
								initial={reduce ? false : { pathLength: 0 }}
								whileInView={{ pathLength: 1 }}
								viewport={{ once: true }}
								transition={{
									duration: 0.8,
									delay: 0.3 + i * 0.15,
									ease: 'easeOut',
								}}
							/>
							{/* Flow animation pulses */}
							{!reduce && (
								<motion.path
									d={d}
									stroke="var(--color-primary)"
									strokeWidth={3}
									strokeLinecap="round"
									strokeDasharray="4 12"
									initial={{
										pathLength: 0,
										strokeDashoffset: 0,
									}}
									whileInView={{
										pathLength: 1,
										strokeDashoffset: [0, -32],
									}}
									viewport={{ once: true }}
									transition={{
										pathLength: {
											duration: 0.8,
											delay: 0.3 + i * 0.15,
										},
										strokeDashoffset: {
											duration: 1.5,
											repeat: Infinity,
											ease: 'linear',
											delay: 0.8 + i * 0.15,
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
							r={3.5}
							fill="var(--color-background)"
							stroke="var(--color-primary)"
							strokeOpacity={0.8}
							strokeWidth={2}
						/>
					))}
				</svg>

				{/* Floating simulated mouse cursor to show visual action */}
				{!reduce && (
					<motion.div
						className="pointer-events-none absolute z-30 flex items-center gap-1.5"
						animate={{
							x: [240, 310, 310, 480, 240],
							y: [140, 125, 125, 65, 140],
						}}
						transition={{
							duration: 12,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					>
						<svg
							className="size-5 text-primary drop-shadow-[0_2px_8px_rgba(139,92,246,0.55)]"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M4.5 3v15.3l4.7-4.6 3.8 8.8 3.5-1.5-3.8-8.8 6-0.2z" />
						</svg>
						<span className="rounded-md bg-primary/95 px-2 py-0.5 font-mono text-[9px] font-semibold text-white shadow-lg backdrop-blur-xs">
							Stepwize AI
						</span>
					</motion.div>
				)}

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
							initial={
								reduce
									? false
									: { opacity: 0, scale: 0.9, y: 8 }
							}
							whileInView={{ opacity: 1, scale: 1, y: 0 }}
							whileHover={{ scale: 1.03, y: -2 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.5,
								delay: 0.15 + i * 0.1,
								ease: EASE,
							}}
						>
							<SpotlightCard
								className={`relative flex h-full items-center gap-3 rounded-xl border bg-card/90 px-3.5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md ${node.primary ? 'border-primary/20 shadow-primary/5' : 'border-border'}`}
								spotlightColor="rgba(139, 92, 246, 0.2)"
							>
								{node.primary && (
									<span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
									</span>
								)}
								<span
									className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${node.color}`}
								>
									<Icon className="size-5" />
								</span>
								<span className="min-w-0 leading-tight">
									<span className="block truncate text-sm font-semibold text-foreground">
										{node.label}
									</span>
									<span className="block truncate text-[11px] font-medium text-muted-foreground/80">
										{node.sub}
									</span>
								</span>
							</SpotlightCard>
						</motion.div>
					);
				})}
			</div>

			{/* Bottom mask gradient */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background to-transparent" />
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
			{/* ── Background Grid & Top Ambient Glow ── */}
			<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: [
							'linear-gradient(to right, oklch(0.45 0 0 / 6%) 1px, transparent 1px)',
							'linear-gradient(to bottom, oklch(0.45 0 0 / 6%) 1px, transparent 1px)',
						].join(', '),
						backgroundSize: '48px 48px',
						maskImage:
							'radial-gradient(120% 90% at 50% 0%, black, transparent 75%)',
						WebkitMaskImage:
							'radial-gradient(120% 90% at 50% 0%, black, transparent 75%)',
					}}
				/>
				<div className="absolute left-1/2 top-[-20%] h-[120%] w-[1000px] -translate-x-1/2">
					<LightPillar
						topColor="#8B5CF6"
						bottomColor="#D946EF"
						interactive={true}
						className="opacity-60 dark:opacity-70 dark:mix-blend-screen"
					/>
				</div>
			</div>

			<div className="mx-auto max-w-6xl px-6 pb-14 pt-24 text-center sm:px-8 sm:pt-32">
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
				>
					{/* Pill Eyebrow */}
					<motion.div variants={item} className="flex justify-center">
						<StarBorder
							as="button"
							type="button"
							onClick={() => {
								import('@/lib/utils').then(({ scrollToId }) =>
									scrollToId('features'),
								);
							}}
							color="var(--color-primary)"
							thickness={1.5}
							speed="4s"
							className="group shadow-xs transition-all hover:shadow-neon"
							contentClassName="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs backdrop-blur-md bg-background/60 border border-primary/20 hover:bg-primary/10 hover:border-primary/40"
						>
							<span className="rounded-full bg-linear-to-r from-primary to-accent px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-primary-foreground shadow-neon">
								New
							</span>
							<span className="font-semibold text-muted-foreground/90 group-hover:text-foreground">
								AI-native nodes are here
							</span>
							<IconArrowRight className="size-3.5 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
						</StarBorder>
					</motion.div>

					{/* Modernised Typography Header */}
					<motion.h1
						variants={item}
						className="mx-auto mt-7 max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
					>
						<span className="bg-linear-to-b from-foreground via-foreground/95 to-foreground/80 bg-clip-text text-transparent drop-shadow-sm">
							Automate the busywork.
						</span>
						<br />
						<span className="bg-linear-to-r from-primary via-secondary-foreground to-ring bg-clip-text text-transparent drop-shadow-neon">
							Build what matters.
						</span>
					</motion.h1>

					{/* Description */}
					<motion.p
						variants={item}
						className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground/90 sm:text-lg"
					>
						Stepwize is the open-source workflow builder for
						connecting your APIs, scheduling jobs, and orchestrating
						your entire stack — visually, with zero code.
					</motion.p>

					{/* Animated CTA Buttons */}
					<motion.div
						variants={item}
						className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
					>
						<ElectricBorder
							color="#8B5CF6"
							borderRadius={12}
							className="rounded-xl"
							speed={1.5}
						>
							<Button
								size="lg"
								className="group h-11 px-6 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-xs shadow-primary/5 rounded-xl border border-primary/20"
								nativeButton={false}
								render={<Link href="/sign-up" />}
							>
								Start building free
								<IconArrowRight className="size-4.5 transition-transform group-hover:translate-x-0.5" />
							</Button>
						</ElectricBorder>
						<Button
							variant="secondary"
							size="lg"
							className="group h-11 px-6 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
							nativeButton={false}
							render={<Link href="#" />}
						>
							<IconBrandGithub className="size-4.5 text-muted-foreground group-hover:text-foreground" />
							<span>Star on GitHub</span>
							<span className="ml-1.5 flex items-center gap-0.5 text-muted-foreground/70 font-semibold group-hover:text-foreground/90">
								<IconStarFilled className="size-3 text-amber-500" />
								2.4k
							</span>
						</Button>
					</motion.div>

					{/* Subtext */}
					<motion.p
						variants={item}
						className="mt-6 text-xs font-medium text-muted-foreground/80 tracking-wide"
					>
						No credit card required · Open source · Self-hostable
					</motion.p>
				</motion.div>

				{/* Mockup Flow Editor Frame */}
				<motion.div
					initial={reduce ? false : { opacity: 0, y: 32 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
					className="mt-16 relative"
				>
					<div className="absolute -inset-1.5 rounded-3xl bg-linear-to-r from-primary/10 to-indigo-500/10 opacity-30 blur-lg" />
					<WorkflowDiagram />
				</motion.div>
			</div>
		</section>
	);
};
