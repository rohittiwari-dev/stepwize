'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { IconBolt, IconMenu2, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
	{ label: 'Features', href: '#features' },
	{ label: 'How it works', href: '#how-it-works' },
	{ label: 'Integrations', href: '#features' },
	{ label: 'Docs', href: '#' },
] as const;

export const LandingNavbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header
			className={cn(
				'sticky top-0 z-50 transition-colors duration-300',
				scrolled
					? 'border-b border-border/60 bg-background/80 backdrop-blur-md'
					: 'border-b border-transparent',
			)}
		>
			<nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2.5">
					<span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<IconBolt className="size-4.5" />
					</span>
					<span className="text-lg font-bold tracking-tight">
						Stepwize
					</span>
				</Link>

				{/* Desktop links */}
				<div className="hidden items-center gap-1 md:flex">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* Desktop CTAs */}
				<div className="hidden items-center gap-2 md:flex">
					<Button
						variant="ghost"
						size="lg"
						nativeButton={false}
						render={<Link href="/sign-in" />}
					>
						Sign in
					</Button>
					<Button
						size="lg"
						nativeButton={false}
						render={<Link href="/sign-up" />}
					>
						Get started
					</Button>
				</div>

				{/* Mobile toggle */}
				<button
					type="button"
					onClick={() => setOpen((o) => !o)}
					aria-label={open ? 'Close menu' : 'Open menu'}
					className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden"
				>
					{open ? <IconX className="size-5" /> : <IconMenu2 className="size-5" />}
				</button>
			</nav>

			{/* Mobile menu */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
						className="overflow-hidden border-b border-border/60 bg-background/95 backdrop-blur-md md:hidden"
					>
						<div className="flex flex-col gap-1 px-6 py-4">
							{NAV_LINKS.map((link) => (
								<Link
									key={link.label}
									href={link.href}
									onClick={() => setOpen(false)}
									className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								>
									{link.label}
								</Link>
							))}
							<div className="mt-2 flex flex-col gap-2">
								<Button
									variant="outline"
									size="lg"
									className="w-full"
									nativeButton={false}
									render={
										<Link href="/sign-in" onClick={() => setOpen(false)} />
									}
								>
									Sign in
								</Button>
								<Button
									size="lg"
									className="w-full"
									nativeButton={false}
									render={
										<Link href="/sign-up" onClick={() => setOpen(false)} />
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
