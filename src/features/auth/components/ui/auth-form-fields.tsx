'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
	IconMail,
	IconLock,
	IconUser,
	IconEye,
	IconEyeOff,
} from '@tabler/icons-react';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import type { AuthMode } from '@/features/auth/types';
import type { AuthFormValues } from '@/features/auth/validations';

interface AuthFormFieldsProps {
	form: UseFormReturn<AuthFormValues>;
	mode: AuthMode;
}

/** Shared classes for the leading icon — tints to primary when the field is focused. */
const LEADING_ICON =
	'pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary';

export const AuthFormFields = ({ form, mode }: AuthFormFieldsProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const {
		register,
		formState: { errors },
	} = form;

	return (
		<div className="space-y-4">
			{/* ── Name (sign-up only) ── */}
			<AnimatePresence initial={false}>
				{mode === 'sign-up' && (
					<motion.div
						key="name"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
						className="-mx-2 overflow-hidden"
					>
						<div className="px-2 pb-0.5 pt-0.5">
							<Field data-invalid={!!errors.name}>
								<FieldLabel htmlFor="name">Full name</FieldLabel>
								<div className="relative">
									<Input
										id="name"
										placeholder="Ada Lovelace"
										className="peer h-11 bg-background pl-9"
										aria-invalid={!!errors.name}
										autoComplete="name"
										{...register('name')}
									/>
									<IconUser className={LEADING_ICON} />
								</div>
								{errors.name && (
									<FieldError errors={[errors.name]} />
								)}
							</Field>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* ── Email ── */}
			<Field data-invalid={!!errors.email}>
				<FieldLabel htmlFor="email">Email</FieldLabel>
				<div className="relative">
					<Input
						id="email"
						type="email"
						placeholder="you@company.com"
						className="peer h-11 bg-background pl-9"
						aria-invalid={!!errors.email}
						autoComplete="email"
						{...register('email')}
					/>
					<IconMail className={LEADING_ICON} />
				</div>
				{errors.email && <FieldError errors={[errors.email]} />}
			</Field>

			{/* ── Password ── */}
			<Field data-invalid={!!errors.password}>
				<div className="flex items-center justify-between">
					<FieldLabel htmlFor="password">Password</FieldLabel>
					{mode === 'sign-in' && (
						<Link
							href="/forgot-password"
							className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
						>
							Forgot password?
						</Link>
					)}
				</div>
				<div className="relative">
					<Input
						id="password"
						type={showPassword ? 'text' : 'password'}
						placeholder="••••••••"
						className="peer h-11 bg-background pl-9 pr-10"
						aria-invalid={!!errors.password}
						autoComplete={
							mode === 'sign-up'
								? 'new-password'
								: 'current-password'
						}
						{...register('password')}
					/>
					<IconLock className={LEADING_ICON} />
					<button
						type="button"
						onClick={() => setShowPassword((s) => !s)}
						aria-label={
							showPassword ? 'Hide password' : 'Show password'
						}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
					>
						{showPassword ? (
							<IconEyeOff className="size-4" />
						) : (
							<IconEye className="size-4" />
						)}
					</button>
				</div>
				{errors.password ? (
					<FieldError errors={[errors.password]} />
				) : (
					mode === 'sign-up' && (
						<p className="text-xs text-muted-foreground">
							Use at least 8 characters.
						</p>
					)
				)}
			</Field>
		</div>
	);
};
