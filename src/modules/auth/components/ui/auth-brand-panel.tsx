'use client';

import { motion, useReducedMotion } from 'motion/react';
import {
	IconBolt,
	IconFilter,
	IconSparkles,
	IconBrandSlack,
	IconDatabase,
} from '@tabler/icons-react';

/* ─────────────────────────────────────────────────────────────
   Workflow graph — every node and wire lives in ONE fixed
   coordinate space (the CANVAS box below), so wires can never
   drift away from nodes on resize. This is the "no-leak" fix.
   ───────────────────────────────────────────────────────────── */

const CANVAS = { w: 248, h: 286 };

const NODES = [
	{
		id: 'trigger',
		cx: 124,
		cy: 30,
		w: 120,
		icon: IconBolt,
		label: 'Webhook',
		sub: 'Trigger',
	},
	{
		id: 'filter',
		cx: 124,
		cy: 104,
		w: 120,
		icon: IconFilter,
		label: 'Filter',
		sub: 'Condition',
	},
	{
		id: 'agent',
		cx: 124,
		cy: 178,
		w: 120,
		icon: IconSparkles,
		label: 'AI Agent',
		sub: 'GPT-4o',
	},
	{
		id: 'slack',
		cx: 64,
		cy: 252,
		w: 104,
		icon: IconBrandSlack,
		label: 'Slack',
		sub: 'Notify',
	},
	{
		id: 'db',
		cx: 184,
		cy: 252,
		w: 104,
		icon: IconDatabase,
		label: 'Database',
		sub: 'Insert',
	},
] as const;

const NODE_H = 38;

const EDGES = [
	{ id: 'e1', d: 'M124 49 L124 85' },
	{ id: 'e2', d: 'M124 123 L124 159' },
	{ id: 'e3', d: 'M124 197 C124 216 64 214 64 233' },
	{ id: 'e4', d: 'M124 197 C124 216 184 214 184 233' },
] as const;

// Connection points where wires meet nodes (rendered as ports).
const PORTS = [
	[124, 49],
	[124, 85],
	[124, 123],
	[124, 159],
	[124, 197],
	[64, 233],
	[184, 233],
] as const;

const STATS = [
	{ value: '200+', label: 'Integrations' },
	{ value: '99.9%', label: 'Uptime SLA' },
	{ value: '12k+', label: 'Teams' },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

const WorkflowCanvas = () => {
	const reduce = useReducedMotion();

	return (
		<div
			className="relative"
			style={{ width: CANVAS.w, height: CANVAS.h }}
			aria-hidden
		>
			{/* ── Wires + ports (shared coordinate space) ── */}
			<svg
				className="absolute inset-0 overflow-visible"
				width={CANVAS.w}
				height={CANVAS.h}
				viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
				fill="none"
			>
				{EDGES.map((edge, i) => (
					<g key={edge.id}>
						{/* base wire */}
						<motion.path
							d={edge.d}
							stroke="var(--primary-foreground)"
							strokeOpacity={0.16}
							strokeWidth={1.5}
							strokeLinecap="round"
							initial={reduce ? false : { pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{
								duration: 0.7,
								delay: 0.35 + i * 0.12,
								ease: 'easeOut',
							}}
						/>
						{/* flowing data pulse */}
						{!reduce && (
							<motion.path
								d={edge.d}
								stroke="var(--primary-foreground)"
								strokeOpacity={0.65}
								strokeWidth={2}
								strokeLinecap="round"
								strokeDasharray="0.5 7"
								initial={{ pathLength: 0, strokeDashoffset: 0 }}
								animate={{
									pathLength: 1,
									strokeDashoffset: [0, -15],
								}}
								transition={{
									pathLength: {
										duration: 0.7,
										delay: 0.35 + i * 0.12,
									},
									strokeDashoffset: {
										duration: 1.1,
										repeat: Infinity,
										ease: 'linear',
										delay: 1.1 + i * 0.18,
									},
								}}
							/>
						)}
					</g>
				))}

				{/* ports */}
				{PORTS.map(([x, y], i) => (
					<motion.circle
						key={i}
						cx={x}
						cy={y}
						r={2.5}
						fill="var(--primary)"
						stroke="var(--primary-foreground)"
						strokeOpacity={0.45}
						strokeWidth={1.5}
						initial={reduce ? false : { scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.3,
							delay: 0.6 + i * 0.05,
							ease: 'easeOut',
						}}
						style={{ transformOrigin: `${x}px ${y}px` }}
					/>
				))}
			</svg>

			{/* ── Nodes ── */}
			{NODES.map((node, i) => {
				const Icon = node.icon;
				return (
					<motion.div
						key={node.id}
						className="absolute"
						style={{
							left: node.cx - node.w / 2,
							top: node.cy - NODE_H / 2,
							width: node.w,
							height: NODE_H,
						}}
						initial={
							reduce ? false : { opacity: 0, scale: 0.85, y: 4 }
						}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: 0.5 + i * 0.12,
							ease: EASE,
						}}
					>
						<div className="flex h-full items-center gap-2 rounded-[10px] border border-primary-foreground/15 bg-primary-foreground/10 px-2.5 shadow-lg shadow-black/10 backdrop-blur-md">
							<span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-primary-foreground/15 bg-primary-foreground/15">
								<Icon className="size-3.5 text-primary-foreground" />
							</span>
							<span className="min-w-0 leading-tight">
								<span className="block truncate text-[11px] font-semibold text-primary-foreground">
									{node.label}
								</span>
								<span className="block truncate text-[9px] text-primary-foreground/55">
									{node.sub}
								</span>
							</span>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
};

export const AuthBrandPanel = () => {
	const reduce = useReducedMotion();
	const year = new Date().getFullYear();

	return (
		<div className="relative hidden w-[42%] shrink-0 flex-col overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
			{/* ── Depth: radial highlight + bottom darken (stays in-palette) ── */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background: [
						'radial-gradient(120% 75% at 50% -10%, color-mix(in oklch, var(--primary) 78%, white 22%), transparent 60%)',
						'linear-gradient(to bottom, transparent 55%, color-mix(in oklch, var(--primary), black 28%))',
					].join(', '),
				}}
			/>

			{/* ── Faint grid ── */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.06]"
				style={{
					backgroundImage: [
						'linear-gradient(to right, currentColor 1px, transparent 1px)',
						'linear-gradient(to bottom, currentColor 1px, transparent 1px)',
					].join(', '),
					backgroundSize: '36px 36px',
					maskImage:
						'radial-gradient(120% 90% at 50% 30%, black, transparent 75%)',
					WebkitMaskImage:
						'radial-gradient(120% 90% at 50% 30%, black, transparent 75%)',
				}}
			/>

			{/* ── Contained ambient glows ── */}
			<motion.div
				className="pointer-events-none absolute top-[-12%] right-[-10%] size-[320px] rounded-full bg-primary-foreground/10 blur-[90px]"
				animate={
					reduce
						? undefined
						: { scale: [1, 1.12, 1], opacity: [0.6, 0.85, 0.6] }
				}
				transition={{
					duration: 14,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>
			<motion.div
				className="pointer-events-none absolute bottom-[-8%] left-[-12%] size-[280px] rounded-full bg-primary-foreground/[0.07] blur-[90px]"
				animate={
					reduce
						? undefined
						: { scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }
				}
				transition={{
					duration: 18,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>

			{/* ── Content ── */}
			<div className="relative z-10 flex h-full flex-col">
				{/* Logo */}
				<motion.div
					className="flex items-center gap-2.5"
					initial={reduce ? false : { opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: EASE }}
				>
					<span className="flex size-9 items-center justify-center rounded-lg border border-primary-foreground/15 bg-primary-foreground/15 backdrop-blur-sm">
						<IconBolt className="size-5" />
					</span>
					<span className="text-xl font-bold tracking-tight">
						Stepwize
					</span>
				</motion.div>

				{/* Workflow showcase */}
				<div className="flex flex-1 flex-col items-center justify-center py-8">
					<motion.div
						className="mb-4 flex items-center gap-2 self-start rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1 text-[11px] font-medium text-primary-foreground/80 backdrop-blur-sm"
						initial={reduce ? false : { opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
					>
						<span className="relative flex size-1.5">
							{!reduce && (
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-primary-foreground/70" />
							)}
							<span className="relative inline-flex size-1.5 rounded-full bg-primary-foreground" />
						</span>
						Live workflow
					</motion.div>

					{/* App window */}
					<motion.div
						className="w-full max-w-[300px] rounded-2xl border border-primary-foreground/15 bg-primary-foreground/6 p-3 shadow-2xl shadow-black/30 backdrop-blur-md"
						initial={
							reduce ? false : { opacity: 0, scale: 0.96, y: 12 }
						}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
					>
						{/* titlebar */}
						<div className="mb-2 flex items-center justify-between px-1">
							<div className="flex items-center gap-1.5">
								<span className="size-2 rounded-full bg-primary-foreground/25" />
								<span className="size-2 rounded-full bg-primary-foreground/25" />
								<span className="size-2 rounded-full bg-primary-foreground/25" />
							</div>
							<span className="font-mono text-[10px] text-primary-foreground/45">
								automation.flow
							</span>
							<span className="text-[10px] font-medium text-primary-foreground/45">
								·{' '}5 steps
							</span>
						</div>

						{/* canvas */}
						<div
							className="relative flex items-center justify-center overflow-hidden rounded-xl border border-primary-foreground/10 bg-[color-mix(in_oklch,var(--primary),black_14%)] p-2"
							style={{
								backgroundImage:
									'radial-gradient(circle, color-mix(in oklch, var(--primary-foreground) 12%, transparent) 1px, transparent 1px)',
								backgroundSize: '14px 14px',
							}}
						>
							<WorkflowCanvas />
						</div>
					</motion.div>
				</div>

				{/* Headline + proof */}
				<motion.div
					initial={reduce ? false : { opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
				>
					<h2 className="text-[1.7rem] font-bold leading-[1.15] tracking-tight">
						Automate the busywork.
						<br />
						Focus on what matters.
					</h2>
					<p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
						Design, run, and monitor powerful workflows on a visual
						canvas — connect any API, no code required.
					</p>

					<div className="mt-7 flex items-stretch gap-5 border-t border-primary-foreground/10 pt-5">
						{STATS.map((stat) => (
							<div key={stat.label}>
								<p className="text-lg font-bold tracking-tight">
									{stat.value}
								</p>
								<p className="text-xs text-primary-foreground/55">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</motion.div>

				{/* Footer */}
				<p className="mt-8 text-xs text-primary-foreground/40">
					© {year} Stepwize. All rights reserved.
				</p>
			</div>
		</div>
	);
};
