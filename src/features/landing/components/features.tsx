'use client';

import { motion } from 'motion/react';
import { EASE } from './reveal';
import MagicBento from '@/components/ui/magic-bento';

export const LandingFeatures = () => {
	return (
		<section
			id="features"
			className="relative py-24 sm:py-32 overflow-hidden"
		>
			<div className="mx-auto max-w-6xl px-6 sm:px-8 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: EASE }}
					className="mx-auto max-w-2xl text-center mb-16"
				>
					<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
						Features that{' '}
						<span className="bg-linear-to-r from-violet-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
							accelerate
						</span>{' '}
						your team
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Stepwize brings the full power of workflow automation
						into a visual, intuitive interface. Built for speed and
						scale.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
					className="relative"
				>
					{/* Utilizing the MagicBento grid for features */}
					<MagicBento
						glowColor="139, 92, 246"
						enableStars={true}
						enableSpotlight={true}
						enableBorderGlow={true}
						particleCount={20}
					/>
				</motion.div>
			</div>
		</section>
	);
};
