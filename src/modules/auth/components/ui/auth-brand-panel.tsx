'use client';

import { motion } from 'motion/react';
import {
	IconBolt,
	IconArrowsShuffle,
	IconCloudComputing,
	IconDeviceAnalytics,
} from '@tabler/icons-react';

const FEATURES = [
	{
		icon: IconArrowsShuffle,
		title: 'Visual Workflow Builder',
		description: 'Drag-and-drop interface to design complex automations',
	},
	{
		icon: IconCloudComputing,
		title: '200+ Integrations',
		description: 'Connect your favourite tools and services seamlessly',
	},
	{
		icon: IconDeviceAnalytics,
		title: 'Real-time Monitoring',
		description: 'Track every execution with detailed logs and metrics',
	},
] as const;

/** Floating workflow node graphic */
const WorkflowNode = ({
	x,
	y,
	delay,
	size = 48,
}: {
	x: string;
	y: string;
	delay: number;
	size?: number;
}) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.6 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ delay, duration: 0.8, ease: 'easeOut' }}
		className="absolute"
		style={{ left: x, top: y }}
	>
		<motion.div
			animate={{ y: [0, -8, 0] }}
			transition={{
				duration: 4 + delay,
				repeat: Infinity,
				ease: 'easeInOut',
			}}
			className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm"
			style={{ width: size, height: size }}
		>
			<div className="flex h-full items-center justify-center">
				<div
					className="rounded-md bg-primary-foreground/20"
					style={{
						width: size * 0.4,
						height: size * 0.2,
					}}
				/>
			</div>
		</motion.div>
	</motion.div>
);

/** Animated connection line between nodes */
const ConnectionLine = ({
	x1,
	y1,
	x2,
	y2,
	delay,
}: {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	delay: number;
}) => (
	<motion.line
		x1={x1}
		y1={y1}
		x2={x2}
		y2={y2}
		stroke="currentColor"
		strokeWidth={1.5}
		strokeDasharray="6 4"
		className="text-primary-foreground/20"
		initial={{ pathLength: 0 }}
		animate={{ pathLength: 1 }}
		transition={{ delay, duration: 1.2, ease: 'easeOut' }}
	/>
);

export const AuthBrandPanel = () => {
	return (
		<div className="relative hidden lg:flex w-[40%] shrink-0 flex-col justify-between h-full bg-primary p-10 text-primary-foreground overflow-hidden">
			{/* ── Grid overlay ── */}
			<div
				className="absolute inset-0 opacity-[0.05]"
				style={{
					backgroundImage: [
						'linear-gradient(to right, currentColor 1px, transparent 1px)',
						'linear-gradient(to bottom, currentColor 1px, transparent 1px)',
					].join(', '),
					backgroundSize: '32px 32px',
				}}
			/>

			{/* ── Ambient glows ── */}
			<motion.div
				animate={{
					x: [0, 30, -20, 0],
					y: [0, -25, 15, 0],
					scale: [1, 1.08, 0.95, 1],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: 'easeInOut' as const,
				}}
				className="absolute top-[5%] right-[5%] h-[300px] w-[300px] rounded-full bg-primary-foreground/8 blur-[80px]"
			/>
			<motion.div
				animate={{
					x: [0, -20, 25, 0],
					y: [0, 20, -15, 0],
					scale: [1, 0.95, 1.05, 1],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					ease: 'easeInOut' as const,
				}}
				className="absolute bottom-[10%] left-[10%] h-[250px] w-[250px] rounded-full bg-primary-foreground/6 blur-[80px]"
			/>

			{/* ── Workflow graphic nodes ── */}
			<WorkflowNode x="65%" y="12%" delay={0.3} size={52} />
			<WorkflowNode x="78%" y="35%" delay={0.6} size={40} />
			<WorkflowNode x="55%" y="55%" delay={0.9} size={44} />
			<WorkflowNode x="72%" y="72%" delay={1.2} size={36} />
			<WorkflowNode x="85%" y="18%" delay={0.5} size={32} />

			{/* ── Connection lines (SVG overlay) ── */}
			<svg className="absolute inset-0 h-full w-full pointer-events-none">
				<ConnectionLine
					x1={340}
					y1={80}
					x2={400}
					y2={200}
					delay={0.8}
				/>
				<ConnectionLine
					x1={400}
					y1={200}
					x2={310}
					y2={330}
					delay={1.1}
				/>
				<ConnectionLine
					x1={310}
					y1={330}
					x2={380}
					y2={440}
					delay={1.4}
				/>
			</svg>

			{/* ── Floating dots ── */}
			{[
				{ x: '50%', y: '20%', delay: 0 },
				{ x: '90%', y: '50%', delay: 0.4 },
				{ x: '60%', y: '85%', delay: 0.8 },
				{ x: '45%', y: '45%', delay: 1.0 },
			].map((dot, i) => (
				<motion.div
					key={i}
					className="absolute h-1.5 w-1.5 rounded-full bg-primary-foreground/30"
					style={{ left: dot.x, top: dot.y }}
					animate={{
						opacity: [0.3, 0.8, 0.3],
						scale: [1, 1.5, 1],
					}}
					transition={{
						delay: dot.delay,
						duration: 3,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
			))}

			{/* ── Logo ── */}
			<div className="relative z-10">
				<div className="flex items-center gap-2.5">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15 backdrop-blur-sm">
						<IconBolt className="h-5 w-5" />
					</div>
					<span className="text-xl font-bold tracking-tight">
						Stepwize
					</span>
				</div>
			</div>

			{/* ── Hero copy ── */}
			<div className="relative z-10 space-y-6">
				<div>
					<h2 className="text-3xl font-bold leading-tight tracking-tight">
						Automate anything.
						<br />
						Ship faster.
					</h2>
					<p className="mt-3 text-sm text-primary-foreground/70 max-w-xs leading-relaxed">
						Build powerful workflows with a visual editor. Connect
						APIs, schedule tasks, and orchestrate your entire stack.
					</p>
				</div>

				{/* ── Features ── */}
				<div className="space-y-4 pt-2">
					{FEATURES.map(({ icon: Icon, title, description }) => (
						<div key={title} className="flex items-start gap-3">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
								<Icon className="h-4 w-4" />
							</div>
							<div>
								<p className="text-sm font-medium">{title}</p>
								<p className="text-xs text-primary-foreground/60 leading-relaxed">
									{description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* ── Footer ── */}
			<p className="relative z-10 text-xs text-primary-foreground/40">
				© {new Date().getFullYear()} Stepwize. All rights reserved.
			</p>
		</div>
	);
};
