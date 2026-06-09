'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
	children: ReactNode;
	delay?: number;
	y?: number;
	className?: string;
}

/** Lightweight scroll-into-view reveal — respects reduced motion. */
export const Reveal = ({ children, delay = 0, y = 24, className }: RevealProps) => {
	const reduce = useReducedMotion();

	return (
		<motion.div
			className={className}
			initial={reduce ? false : { opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-80px' }}
			transition={{ duration: 0.6, delay, ease: EASE }}
		>
			{children}
		</motion.div>
	);
};
