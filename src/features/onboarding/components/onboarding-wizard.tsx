'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
	IconArrowRight,
	IconArrowLeft,
	IconLoader2,
	IconRocket,
	IconKey,
	IconUserPlus,
	IconCheck,
	IconBuilding,
	IconWorld,
	IconSparkles,
	IconX,
	IconTrash,
	IconPlus,
	IconShieldCheck,
	IconAlertCircle,
	IconEdit,
} from '@tabler/icons-react';
import { StepwizeLogo } from '@/components/icons/stepwize-logo';
import { authClient } from '@/lib/auth/clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OnboardingWizardProps {
}

type Step = 'workspace' | 'invite' | 'complete';

function getSteps(): Step[] {
	return ['workspace', 'invite', 'complete'];
}

const STEP_META: Record<
	Step,
	{ icon: typeof IconRocket; title: string; subtitle: string }
> = {
	workspace: {
		icon: IconBuilding,
		title: 'Name your workspace',
		subtitle: "This is your team's home. Everything you build lives here.",
	},
	invite: {
		icon: IconUserPlus,
		title: 'Bring your team',
		subtitle: 'Invite collaborators. You can always do this later.',
	},
	complete: {
		icon: IconRocket,
		title: 'Ready to launch',
		subtitle: "Everything's set. Let's build something great.",
	},
};

const EASE = [0.22, 1, 0.36, 1] as const;

function slugify(name: string) {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export function OnboardingWizard() {
	const router = useRouter();
	const reduce = useReducedMotion();
	const steps = getSteps();
	const [stepIndex, setStepIndex] = useState(0);
	const [loading, setLoading] = useState(false);
	const [direction, setDirection] = useState(1);

	const [workspaceName, setWorkspaceName] = useState('');
	const [workspaceSlug, setWorkspaceSlug] = useState('');
	const [slugEdited, setSlugEdited] = useState(false);
	const [slugValid, setSlugValid] = useState<boolean | null>(null);
	const [slugChecking, setSlugChecking] = useState(false);

	const [inviteEmail, setInviteEmail] = useState('');
	const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

	const currentStep = steps[stepIndex];
	const meta = STEP_META[currentStep];
	const Icon = meta.icon;

	const goNext = useCallback(() => {
		setDirection(1);
		setStepIndex((i) => Math.min(i + 1, steps.length - 1));
	}, [steps.length]);

	const goBack = useCallback(() => {
		setDirection(-1);
		setStepIndex((i) => Math.max(i - 1, 0));
	}, []);

	// Validate slug
	useEffect(() => {
		if (!workspaceSlug) {
			return;
		}

		const RESERVED_SLUGS = [
			'dashboard',
			'api',
			'rpc',
			'get-started',
			'sign-in',
			'sign-up',
			'admin',
			'settings',
			'profile',
			'workspace',
			'team',
			'auth',
			'billing',
		];

		const timeoutId = setTimeout(async () => {
			if (RESERVED_SLUGS.includes(workspaceSlug.toLowerCase())) {
				setSlugValid(false);
				setSlugChecking(false);
				return;
			}

			try {
				const res = await authClient.organization.checkSlug({
					slug: workspaceSlug,
				});

				const isAvailable = (res.data as any)?.status || false;

				setSlugValid(isAvailable);
			} catch (_err) {
				setSlugValid(false);
			} finally {
				setSlugChecking(false);
			}
		}, 600);

		return () => clearTimeout(timeoutId);
	}, [workspaceSlug]);

	const handleCreateWorkspace = async () => {
		if (!workspaceName.trim()) {
			toast.error('Workspace name is required');
			return;
		}
		if (slugValid === false) {
			toast.error('Workspace slug is not available');
			return;
		}
		setLoading(true);
		try {
			const { error } = await authClient.organization.create({
				name: workspaceName.trim(),
				slug: workspaceSlug || slugify(workspaceName),
			});
			if (error) {
				toast.error(error.message || 'Failed to create workspace');
				return;
			}
			toast.success('Workspace created!');
			goNext();
		} catch (err: any) {
			toast.error(err.message || 'Failed to create workspace');
		} finally {
			setLoading(false);
		}
	};



	const addEmailToList = () => {
		const email = inviteEmail.trim();
		if (!email) {
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			toast.error('Please enter a valid email address');
			return;
		}
		if (invitedEmails.includes(email)) {
			toast.error('Email already added');
			return;
		}
		setInvitedEmails((prev) => [...prev, email]);
		setInviteEmail('');
	};

	const removeEmail = (email: string) => {
		setInvitedEmails((prev) => prev.filter((e) => e !== email));
	};

	const handleSendAllInvites = async () => {
		if (invitedEmails.length === 0) {
			goNext();
			return;
		}
		setLoading(true);
		try {
			const results = await Promise.allSettled(
				invitedEmails.map((email) =>
					authClient.organization.inviteMember({
						email,
						role: 'member',
					}),
				),
			);
			const failed = results.filter((r) => r.status === 'rejected');
			if (failed.length > 0) {
				toast.error(`${failed.length} invitation(s) failed to send`);
			} else {
				toast.success(`${invitedEmails.length} invitation(s) sent!`);
			}
			goNext();
		} catch (err: any) {
			toast.error(err.message || 'Failed to send invitations');
		} finally {
			setLoading(false);
		}
	};

	const handleComplete = () => router.push('/dashboard');

	const handleStepAction = () => {
		switch (currentStep) {
			case 'workspace':
				return handleCreateWorkspace();
			case 'invite':
				return handleSendAllInvites();
			case 'complete':
				return handleComplete();
		}
	};

	const buttonLabel = {
		workspace: 'Create Workspace',
		invite:
			invitedEmails.length > 0
				? `Send ${invitedEmails.length} Invite${invitedEmails.length > 1 ? 's' : ''}`
				: 'Continue',
		complete: 'Launch Dashboard',
	}[currentStep];

	const isActionDisabled =
		loading ||
		(currentStep === 'workspace' &&
			(!workspaceName.trim() || slugValid !== true || slugChecking));
	const slideVariants = {
		enter: (dir: number) =>
			reduce ? { opacity: 0 } : { opacity: 0, y: dir > 0 ? 20 : -20 },
		center: { opacity: 1, y: 0 },
		exit: (dir: number) =>
			reduce ? { opacity: 0 } : { opacity: 0, y: dir > 0 ? -20 : 20 },
	};

	return (
		<motion.div
			initial={reduce ? false : { opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: EASE }}
		>
			{/* Logo */}
			<motion.div
				className="mb-10 flex items-center gap-2.5"
				initial={reduce ? false : { opacity: 0, y: -8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: EASE }}
			>
				<StepwizeLogo className="h-7 w-auto" />
				<span className="text-lg font-bold tracking-tight text-foreground">
					Stepwize
				</span>
			</motion.div>

			{/* Progress bar */}
			<div className="mb-2 flex gap-2">
				{steps.map((_step, i) => {
					const isDone = i < stepIndex;
					const isActive = i === stepIndex;
					return (
						<div
							key={_step}
							className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted"
						>
							<motion.div
								className="absolute inset-y-0 left-0 rounded-full bg-primary"
								initial={false}
								animate={{
									width: isDone
										? '100%'
										: isActive
											? '45%'
											: '0%',
								}}
								transition={{ duration: 0.5, ease: EASE }}
								style={{
									boxShadow:
										isActive || isDone
											? 'var(--shadow-neon)'
											: 'none',
								}}
							/>
						</div>
					);
				})}
			</div>

			{/* Step counter */}
			<div className="mb-8 flex items-center justify-between">
				<p className="text-xs font-medium text-muted-foreground">
					Step {stepIndex + 1} of {steps.length}
				</p>
				{currentStep !== 'complete' && (
					<div className="flex items-center gap-1 text-xs text-muted-foreground/60">
						<IconShieldCheck className="size-3" />
						<span>Encrypted</span>
					</div>
				)}
			</div>

			{/* Main card */}
			<div className="rounded-2xl border border-border bg-card p-6 ring-4 ring-primary/30 sm:p-7">
				<AnimatePresence mode="wait" custom={direction}>
					<motion.div
						key={currentStep}
						custom={direction}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{ duration: 0.3, ease: EASE }}
					>
						{/* Step icon + text */}
						<div className="mb-6 flex items-start gap-3.5">
							<motion.div
								className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary"
								initial={
									reduce ? false : { scale: 0.7, rotate: -8 }
								}
								animate={{ scale: 1, rotate: 0 }}
								transition={{
									duration: 0.5,
									delay: 0.05,
									ease: EASE,
								}}
							>
								<Icon className="size-5" />
							</motion.div>
							<div>
								<h1 className="text-lg font-bold tracking-tight text-foreground">
									{meta.title}
								</h1>
								<p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
									{meta.subtitle}
								</p>
							</div>
						</div>

						{/* ── Workspace ── */}
						{currentStep === 'workspace' && (
							<div className="space-y-3">
								<div className="space-y-1.5">
									<Label htmlFor="workspace-name">
										Workspace name
									</Label>
									<Input
										id="workspace-name"
										placeholder="My Company"
										value={workspaceName}
										onChange={(e) => {
											const val = e.target.value;
											setWorkspaceName(val);
											if (!slugEdited) {
												const newSlug = val
													? slugify(val)
													: '';
												setWorkspaceSlug(newSlug);
												setSlugValid(null);
												setSlugChecking(!!newSlug);
											}
										}}
										onKeyDown={(e) =>
											e.key === 'Enter' &&
											handleCreateWorkspace()
										}
										className="h-11"
										autoFocus
									/>
								</div>
								<AnimatePresence>
									{workspaceName && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{
												opacity: 1,
												height: 'auto',
											}}
											exit={{ opacity: 0, height: 0 }}
											className="overflow-hidden"
										>
											<div className="flex flex-col gap-1.5 pt-1">
												<Label className="text-xs text-muted-foreground">
													Workspace URL
												</Label>
												<div className="flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 transition-colors focus-within:border-primary/40 focus-within:bg-primary/10">
													<IconWorld className="size-3.5 shrink-0 text-primary/60" />
													<span className="text-sm text-muted-foreground">
														stepwize.app/
													</span>
													<input
														type="text"
														value={workspaceSlug}
														onChange={(e) => {
															setSlugEdited(true);
															const newSlug =
																slugify(
																	e.target
																		.value,
																);
															setWorkspaceSlug(
																newSlug,
															);
															setSlugValid(null);
															setSlugChecking(
																!!newSlug,
															);
														}}
														className="w-full bg-transparent p-0 text-sm font-semibold text-primary focus:outline-none focus:ring-0"
														placeholder="my-workspace"
													/>
													<div className="shrink-0 flex items-center justify-center gap-1.5">
														{!slugChecking &&
															slugValid ===
																null &&
															workspaceSlug && (
																<IconEdit className="size-3.5 text-primary/40" />
															)}
														{slugChecking ? (
															<IconLoader2 className="size-4 animate-spin text-muted-foreground" />
														) : slugValid ===
														  true ? (
															<IconCheck className="size-4 text-emerald-500" />
														) : slugValid ===
														  false ? (
															<IconX className="size-4 text-destructive" />
														) : null}
													</div>
												</div>
												<AnimatePresence>
													{slugValid === false && (
														<motion.p
															initial={{
																opacity: 0,
																y: -4,
																height: 0,
															}}
															animate={{
																opacity: 1,
																y: 0,
																height: 'auto',
															}}
															exit={{
																opacity: 0,
																y: -4,
																height: 0,
															}}
															className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 px-1"
														>
															<IconAlertCircle className="size-3.5 shrink-0" />
															This URL is already
															taken. Please edit
															it to continue.
														</motion.p>
													)}
												</AnimatePresence>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}



						{/* ── Invite ── */}
						{currentStep === 'invite' && (
							<div className="space-y-3">
								<div className="flex items-end gap-2">
									<div className="flex-1 space-y-1.5">
										<Label htmlFor="invite-email">
											Email address
										</Label>
										<Input
											id="invite-email"
											type="email"
											placeholder="colleague@company.com"
											value={inviteEmail}
											onChange={(e) =>
												setInviteEmail(e.target.value)
											}
											onKeyDown={(e) =>
												e.key === 'Enter' &&
												addEmailToList()
											}
											className="h-11"
											autoFocus
										/>
									</div>
									<Button
										type="button"
										variant="secondary"
										onClick={addEmailToList}
										disabled={!inviteEmail.trim()}
										className="h-11 gap-1.5 px-4"
									>
										<IconPlus className="size-3.5" />
										Add
									</Button>
								</div>

								<AnimatePresence>
									{invitedEmails.length > 0 && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{
												opacity: 1,
												height: 'auto',
											}}
											className="space-y-1.5 overflow-hidden pt-1"
										>
											{invitedEmails.map((email, i) => (
												<motion.div
													key={email}
													initial={{
														opacity: 0,
														x: -10,
													}}
													animate={{
														opacity: 1,
														x: 0,
													}}
													transition={{
														delay: i * 0.04,
													}}
													className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/50 px-3 py-2"
												>
													<div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
														<IconUserPlus className="size-3 text-primary" />
													</div>
													<span className="flex-1 text-sm text-foreground/80">
														{email}
													</span>
													<button
														type="button"
														onClick={() =>
															removeEmail(email)
														}
														className="rounded p-0.5 text-muted-foreground/50 transition-colors hover:text-destructive"
													>
														<IconTrash className="size-3.5" />
													</button>
												</motion.div>
											))}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}

						{/* ── Complete ── */}
						{currentStep === 'complete' && (
							<div className="flex flex-col items-center py-6 text-center">
								<motion.div
									className="relative"
									initial={reduce ? false : { scale: 0 }}
									animate={{ scale: 1 }}
									transition={{
										type: 'spring',
										stiffness: 300,
										damping: 20,
										delay: 0.1,
									}}
								>
									<div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
									<div className="relative flex size-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
										<IconSparkles className="size-7 text-primary" />
									</div>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										delay: 0.3,
										duration: 0.5,
										ease: EASE,
									}}
								>
									<p className="mt-5 text-sm text-muted-foreground">
										<span className="font-semibold text-foreground">
											{workspaceName}
										</span>{' '}
										is ready
										{invitedEmails.length > 0 && (
											<>
												{' '}
												with{' '}
												<span className="font-semibold text-foreground">
													{invitedEmails.length}
												</span>{' '}
												member
												{invitedEmails.length > 1
													? 's'
													: ''}{' '}
												invited
											</>
										)}
										.
									</p>
								</motion.div>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Footer actions */}
			<div className="mt-5 flex items-center gap-3">
				{stepIndex > 0 && currentStep !== 'complete' && (
					<Button
						type="button"
						variant="ghost"
						onClick={goBack}
						className="gap-1.5 text-muted-foreground"
					>
						<IconArrowLeft className="size-4" />
						Back
					</Button>
				)}

				<div className="flex-1" />

				{currentStep === 'invite' && invitedEmails.length === 0 && (
					<Button
						type="button"
						variant="ghost"
						onClick={goNext}
						className="text-muted-foreground"
					>
						Skip for now
					</Button>
				)}

				<Button
					type="button"
					onClick={handleStepAction}
					disabled={isActionDisabled}
					className="group h-11 gap-2 rounded-lg px-6 shadow-neon transition-transform hover:scale-[1.02] active:scale-[0.98]"
				>
					{loading ? (
						<IconLoader2 className="size-4 animate-spin" />
					) : (
						<>
							<span>{buttonLabel}</span>
							<IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</>
					)}
				</Button>
			</div>
		</motion.div>
	);
}
