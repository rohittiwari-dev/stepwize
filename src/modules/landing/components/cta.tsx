'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { IconArrowRight } from '@tabler/icons-react';
import { EASE } from './reveal';

export const LandingCta = () => {
	const reduce = useReducedMotion();

	return (
		<section className="px-6 py-24 sm:px-8 sm:py-32">
			<motion.div
				initial={reduce ? false : { opacity: 0, y: 28 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-80px' }}
				transition={{ duration: 0.7, ease: EASE }}
				className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-16 sm:py-20"
			>
				{/* depth + grid (contained, in-palette) */}
				<div
					className="pointer-events-none absolute inset-0"
					style={{
						background:
							'radial-gradient(110% 80% at 50% -10%, color-mix(in oklch, var(--primary) 78%, white 22%), transparent 60%)',
					}}
				/>
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.07]"
					style={{
						backgroundImage: [
							'linear-gradient(to right, currentColor 1px, transparent 1px)',
							'linear-gradient(to bottom, currentColor 1px, transparent 1px)',
						].join(', '),
						backgroundSize: '32px 32px',
						maskImage: 'radial-gradient(100% 100% at 50% 0%, black, transparent 80%)',
						WebkitMaskImage:
							'radial-gradient(100% 100% at 50% 0%, black, transparent 80%)',
					}}
				/>

				<div className="relative">
					<h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
						Ready to automate your workflows?
					</h2>
					<p className="mx-auto mt-4 max-w-md text-pretty text-primary-foreground/75">
						Join thousands of teams shipping automations faster with
						Stepwize. Free to start — no credit card required.
					</p>

					<div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Link
							href="/sign-up"
							className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary-foreground/90"
						>
							Get started free
							<IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</Link>
						<Link
							href="#"
							className="inline-flex h-11 items-center justify-center rounded-lg border border-primary-foreground/25 px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
						>
							Talk to sales
						</Link>
					</div>
				</div>
			</motion.div>
		</section>
	);
};
