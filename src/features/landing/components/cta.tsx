'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { IconArrowRight } from '@tabler/icons-react';
import { EASE } from './reveal';
import StarBorder from '@/components/ui/star-border';

export const LandingCta = () => {
	const reduce = useReducedMotion();

	return (
		<section className="px-6 py-24 sm:px-8 sm:py-32">
			<motion.div
				initial={reduce ? false : { opacity: 0, y: 28 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-80px' }}
				transition={{ duration: 0.7, ease: EASE }}
				className="relative mx-auto max-w-5xl overflow-hidden px-6 py-16 text-center sm:px-16 sm:py-20"
			>
				{/* Depth + Grid mesh (contained in card) */}
				<div
					className="pointer-events-none absolute inset-0 opacity-10"
					style={{
						backgroundImage: [
							'linear-gradient(to right, var(--color-primary) 1px, transparent 1px)',
							'linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)',
						].join(', '),
						backgroundSize: '32px 32px',
						maskImage:
							'radial-gradient(100% 100% at 50% 50%, black, transparent 80%)',
						WebkitMaskImage:
							'radial-gradient(100% 100% at 50% 50%, black, transparent 80%)',
					}}
				/>

				{/* Top-center and bottom-center glows */}
				<div className="pointer-events-none absolute left-1/2 top-[-30%] h-[280px] w-[500px] -translate-x-1/2 rounded-full bg-primary/25 blur-[90px]" />
				<div className="pointer-events-none absolute left-1/2 bottom-[-35%] h-[280px] w-[500px] -translate-x-1/2 rounded-full bg-accent/25 blur-[95px]" />

				<div className="relative z-10">
					<h2 className="mx-auto max-w-2xl text-balance text-3xl font-extrabold tracking-tight sm:text-5xl bg-linear-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
						Ready to automate your workflows?
					</h2>
					<p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground text-sm sm:text-base leading-relaxed">
						Join thousands of teams shipping automations faster with
						Stepwize. Free to start — no credit card required.
					</p>

					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<StarBorder
							as={Link}
							href="/sign-up"
							color="var(--color-primary)"
							speed="4s"
							className="group shadow-neon"
							contentClassName="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-foreground px-8 font-semibold text-background transition-all hover:bg-foreground/90"
						>
							Get started free
							<IconArrowRight className="size-4.5 transition-transform group-hover:translate-x-0.5 text-background" />
						</StarBorder>
						<Link
							href="#"
							className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-border bg-background/50 px-8 font-semibold text-foreground transition-all hover:bg-muted hover:border-border/80 hover:scale-[1.02] active:scale-[0.98]"
						>
							Talk to sales
						</Link>
					</div>
				</div>
			</motion.div>
		</section>
	);
};
