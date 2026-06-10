'use client';

import { motion } from 'motion/react';

interface BackgroundGridProps {
	showGradient?: boolean;
}

export const BackgroundGrid = ({
	showGradient = true,
}: BackgroundGridProps) => {
	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden">
			{/* ── Ambient gradient blobs using design-system primary ── */}
			{showGradient && (
				<div className="absolute inset-0">
					<motion.div
						animate={{
							x: [0, 50, -30, 0],
							y: [0, -35, 25, 0],
							scale: [1, 1.1, 0.95, 1],
						}}
						transition={{
							duration: 22,
							repeat: Infinity,
							ease: 'easeInOut' as const,
						}}
						className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
					/>
					<motion.div
						animate={{
							x: [0, -40, 35, 0],
							y: [0, 45, -35, 0],
							scale: [1, 0.92, 1.08, 1],
						}}
						transition={{
							duration: 28,
							repeat: Infinity,
							ease: 'easeInOut' as const,
						}}
						className="absolute top-[25%] right-[-8%] h-[450px] w-[450px] rounded-full bg-primary/15 blur-[120px]"
					/>
					<motion.div
						animate={{
							x: [0, 30, -40, 0],
							y: [0, 35, 40, 0],
							scale: [1, 1.06, 0.92, 1],
						}}
						transition={{
							duration: 25,
							repeat: Infinity,
							ease: 'easeInOut' as const,
						}}
						className="absolute bottom-[-8%] left-[20%] h-[400px] w-[400px] rounded-full bg-primary/12 blur-[120px]"
					/>
				</div>
			)}
			
			{/* ── Grid lines – uses foreground-relative color, fades top → mid-bottom ── */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: [
						'linear-gradient(to right, oklch(0.45 0 0 / 12%) 1px, transparent 1px)',
						'linear-gradient(to bottom, oklch(0.45 0 0 / 12%) 1px, transparent 1px)',
					].join(', '),
					backgroundSize: '40px 40px',
					maskImage:
						'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.1) 60%, transparent 80%)',
					WebkitMaskImage:
						'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.1) 60%, transparent 80%)',
				}}
			/>

			{/* ── Bottom fade into page bg ── */}
			<div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background to-transparent" />
		</div>
	);
};
