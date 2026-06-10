'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { StepwizeLogo } from '@/components/icons/stepwize-logo';
import { Button } from '@/components/ui/button';
import { cn, scrollToId } from '@/lib/utils';
import { useSession } from '@/lib/auth/clients';
import { ThemeToggle } from '@/components/theme-toggle';

const NAV_LINKS = [
	{ label: 'Features', id: 'features' },
	{ label: 'Integrations', id: 'integrations' },
	{ label: 'Steps', id: 'steps' },
] as const;

export const LandingNavbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const { data: session, isPending } = useSession();

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:px-6">
			<motion.nav
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				className={cn(
					'flex w-full max-w-5xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300',
					scrolled
						? 'border-border/40 bg-background/60 shadow-lg shadow-black/5 backdrop-blur-xl'
						: 'border-transparent bg-transparent',
				)}
			>
				{/* Logo */}
				<button 
					type="button" 
					onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
					className="flex items-center gap-2.5 hover:opacity-80 transition-opacity ml-2"
				>
					<StepwizeLogo className="h-6 w-auto" />
					<span className="text-lg font-bold tracking-tight">Stepwize</span>
				</button>

				{/* Desktop links */}
				<div
					className="hidden items-center gap-1 md:flex"
					onMouseLeave={() => setHoveredIndex(null)}
				>
					{NAV_LINKS.map((link, idx) => (
						<button
							key={link.id}
							type="button"
							onClick={() => scrollToId(link.id)}
							onMouseEnter={() => setHoveredIndex(idx)}
							className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{hoveredIndex === idx && (
								<motion.span
									layoutId="nav-hover-bg"
									className="absolute inset-0 z-0 rounded-full bg-muted/60"
									transition={{
										type: 'spring',
										stiffness: 320,
										damping: 26,
									}}
								/>
							)}
							<span className="relative z-10">{link.label}</span>
						</button>
					))}
				</div>

				{/* Desktop CTAs */}
				<div className="hidden items-center gap-3 md:flex">
					<ThemeToggle />
					{!isPending && !session ? (
						<>
							<Button
								variant="ghost"
								size="sm"
								className="h-9 rounded-full px-4"
								nativeButton={false}
								render={<Link href="/sign-in" />}
							>
								Sign in
							</Button>
							<Button
								size="sm"
								className="h-9 rounded-full px-5 font-medium shadow-neon transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
								nativeButton={false}
								render={<Link href="/sign-up" />}
							>
								Get started
							</Button>
						</>
					) : (
						<>
							<Button
								size="sm"
								className="h-9 rounded-full px-5 font-medium shadow-neon transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
								nativeButton={false}
								render={<Link href="/dashboard" />}
							>
								Open App
							</Button>
						</>
					)}
				</div>

				{/* Mobile toggle */}
				<div className="flex items-center gap-1.5 md:hidden">
					<ThemeToggle />
					<button
						type="button"
						onClick={() => setOpen((o) => !o)}
						aria-label={open ? 'Close menu' : 'Open menu'}
						className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
					>
						{open ? (
							<IconX className="size-5" />
						) : (
							<IconMenu2 className="size-5" />
						)}
					</button>
				</div>
			</motion.nav>

			{/* Mobile menu */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.98 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className="absolute inset-x-4 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-border/40 bg-background/95 shadow-xl backdrop-blur-xl md:hidden"
					>
						<div className="flex flex-col gap-1 p-4">
							{NAV_LINKS.map((link) => (
								<button
									key={link.id}
									type="button"
									onClick={() => {
										scrollToId(link.id);
										setOpen(false);
									}}
									className="rounded-lg px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
								>
									{link.label}
								</button>
							))}
							<div className="mt-3 flex flex-col gap-2 border-t border-border/20 pt-3">
								<Button
									variant="secondary"
									size="lg"
									className="w-full rounded-xl"
									nativeButton={false}
									render={
										<Link
											href="/sign-in"
											onClick={() => setOpen(false)}
										/>
									}
								>
									Sign in
								</Button>
								<Button
									size="lg"
									className="w-full rounded-xl shadow-neon"
									nativeButton={false}
									render={
										<Link
											href="/sign-up"
											onClick={() => setOpen(false)}
										/>
									}
								>
									Get started
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};
