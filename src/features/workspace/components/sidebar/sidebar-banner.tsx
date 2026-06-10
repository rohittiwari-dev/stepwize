'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import {
	IconSparkles,
	IconBulb,
	IconRocket,
	IconKeyboard,
	IconBolt,
	IconX,
	IconChevronLeft,
	IconChevronRight,
} from '@tabler/icons-react';

/* ── Banner Data ── */

type BannerItem = {
	id: string;
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
	cta?: string;
	ctaUrl?: string;
};

const BANNERS: BannerItem[] = [
	{
		id: 'pro-upgrade',
		icon: IconSparkles,
		title: 'Upgrade to Pro',
		description:
			'Unlock unlimited workflows, advanced triggers & priority support.',
		cta: 'Upgrade now',
		ctaUrl: '/dashboard/billing',
	},
	{
		id: 'tip-shortcuts',
		icon: IconKeyboard,
		title: 'Keyboard Shortcuts',
		description:
			'Press ⌘K to open the command palette and speed up your workflow.',
	},
	{
		id: 'tip-templates',
		icon: IconBulb,
		title: 'Start with Templates',
		description:
			'Browse 50+ pre-built workflow templates to get started in seconds.',
		cta: 'Browse templates',
		ctaUrl: '/dashboard/workflows?tab=templates',
	},
	{
		id: 'tip-versioning',
		icon: IconRocket,
		title: 'Version History',
		description:
			'Every workflow change is versioned. Roll back to any point in time.',
	},
	{
		id: 'tip-webhooks',
		icon: IconBolt,
		title: 'Instant Triggers',
		description:
			'Use webhooks to trigger workflows in real-time from any external service.',
	},
];

const ROTATE_INTERVAL = 8000;

/* ── Slide variants ── */

const slideVariants = {
	enter: (direction: number) => ({
		x: direction > 0 ? '100%' : '-100%',
		opacity: 0,
	}),
	center: {
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => ({
		x: direction > 0 ? '-100%' : '100%',
		opacity: 0,
	}),
};

/* ── Component ── */

const SidebarBanner = () => {
	const { open } = useSidebar();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState(1);
	const [dismissed, setDismissed] = useState<Set<string>>(new Set());
	const [isPaused, setIsPaused] = useState(false);

	const availableBanners = BANNERS.filter((b) => !dismissed.has(b.id));

	const goTo = useCallback(
		(index: number) => {
			if (availableBanners.length === 0) {
				return;
			}
			const safeIndex =
				((index % availableBanners.length) + availableBanners.length) %
				availableBanners.length;
			setDirection(safeIndex > currentIndex ? 1 : -1);
			setCurrentIndex(safeIndex);
		},
		[availableBanners.length, currentIndex],
	);

	const next = useCallback(() => {
		setDirection(1);
		setCurrentIndex((prev) =>
			availableBanners.length === 0
				? 0
				: (prev + 1) % availableBanners.length,
		);
	}, [availableBanners.length]);

	const prev = useCallback(() => {
		setDirection(-1);
		setCurrentIndex((prev) =>
			availableBanners.length === 0
				? 0
				: (prev - 1 + availableBanners.length) %
					availableBanners.length,
		);
	}, [availableBanners.length]);

	useEffect(() => {
		if (isPaused || availableBanners.length <= 1) {
			return;
		}
		const timer = setInterval(() => {
			setDirection(1);
			setCurrentIndex((prev) => (prev + 1) % availableBanners.length);
		}, ROTATE_INTERVAL);
		return () => clearInterval(timer);
	}, [isPaused, availableBanners.length]);

	if (!open || availableBanners.length === 0) {
		return null;
	}

	const safeIdx = currentIndex % availableBanners.length;
	const banner = availableBanners[safeIdx];
	const Icon = banner.icon;

	return (
		<div
			className="group/banner relative mx-2 mb-2"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			{/* Gradient backdrop — gives the blur something to frost over */}
			<div className="absolute inset-0 rounded-xl overflow-hidden">
				<div className="absolute -inset-1 bg-linear-to-br from-purple-500/25 via-indigo-500/15 to-cyan-500/20 blur-sm" />
			</div>

			{/* Glass container */}
			<div className="relative overflow-hidden rounded-xl border border-purple-200/60 dark:border-white/10 bg-white/40 dark:bg-white/6 backdrop-blur-xl backdrop-saturate-150 shadow-[0_0_12px_rgba(139,92,246,0.15)] dark:shadow-[0_0_12px_rgba(139,92,246,0.08)]">
				{/* Inner glow edges */}
				<div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-b from-white/10 via-transparent to-transparent" />

				<button
					type="button"
					onClick={() => {
						setDismissed((prev) => new Set([...prev, banner.id]));
						setCurrentIndex(0);
						setDirection(1);
					}}
					className="absolute right-1.5 top-1.5 z-20 rounded-md p-0.5 text-muted-foreground/40 opacity-0 transition-opacity hover:text-foreground group-hover/banner:opacity-100"
				>
					<IconX className="size-3" />
				</button>

				{/* Slide content */}
				<div className="relative h-[100px]">
					<AnimatePresence
						initial={false}
						custom={direction}
						mode="popLayout"
					>
						<motion.div
							key={banner.id}
							custom={direction}
							variants={slideVariants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{
								x: {
									type: 'spring',
									stiffness: 350,
									damping: 35,
								},
								opacity: { duration: 0.2 },
							}}
							className="absolute inset-0 p-3"
						>
							<div className="flex items-start gap-2.5">
								<div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/50">
									<Icon className="size-3.5 text-muted-foreground" />
								</div>
								<div className="min-w-0 flex-1 space-y-0.5">
									<p className="text-xs font-medium leading-tight text-foreground/90">
										{banner.title}
									</p>
									<p className="text-[11px] leading-relaxed text-muted-foreground">
										{banner.description}
									</p>
									{banner.cta && (
										<a
											href={banner.ctaUrl ?? '#'}
											className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-primary transition-colors hover:text-primary/80"
										>
											{banner.cta}
											<span>→</span>
										</a>
									)}
								</div>
							</div>
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Navigation */}
				<div className="relative z-10 flex items-center justify-between border-t border-border/30 px-2.5 py-1.5">
					<div className="flex items-center gap-1">
						{availableBanners.map((b, i) => (
							<button
								key={b.id}
								type="button"
								onClick={() => goTo(i)}
								className={`h-1 rounded-full transition-all duration-300 ${
									i === safeIdx
										? 'w-3.5 bg-primary/60'
										: 'w-1 bg-muted-foreground/20 hover:bg-muted-foreground/30'
								}`}
							/>
						))}
					</div>
					<div className="flex items-center gap-0.5">
						<button
							type="button"
							onClick={prev}
							className="rounded p-0.5 text-muted-foreground/40 transition-colors hover:text-foreground"
						>
							<IconChevronLeft className="size-3" />
						</button>
						<button
							type="button"
							onClick={next}
							className="rounded p-0.5 text-muted-foreground/40 transition-colors hover:text-foreground"
						>
							<IconChevronRight className="size-3" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SidebarBanner;
