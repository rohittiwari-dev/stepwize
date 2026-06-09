'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import type { AuthMode } from '@/modules/auth/types';
import type { AuthFormValues } from '@/modules/auth/validations';

interface AuthFormFieldsProps {
	form: UseFormReturn<AuthFormValues>;
	mode: AuthMode;
}

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
						transition={{ duration: 0.2 }}
						className="-mx-2 overflow-hidden"
					>
						<div className="px-2 pb-0.5 pt-0.5">
							<Field data-invalid={!!errors.name}>
								<FieldLabel htmlFor="name">Full Name</FieldLabel>
								<div className="relative">
									<IconUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="name"
										placeholder="John Doe"
										className="pl-9 h-10"
										aria-invalid={!!errors.name}
										{...register('name')}
									/>
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
					<IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						className="pl-9 h-10"
						aria-invalid={!!errors.email}
						{...register('email')}
					/>
				</div>
				{errors.email && <FieldError errors={[errors.email]} />}
			</Field>

			{/* ── Password ── */}
			<Field data-invalid={!!errors.password}>
				<FieldLabel htmlFor="password">Password</FieldLabel>
				<div className="relative">
					<IconLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="password"
						type={showPassword ? 'text' : 'password'}
						placeholder="••••••••"
						className="pl-9 pr-10 h-10"
						aria-invalid={!!errors.password}
						{...register('password')}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
					>
						{showPassword ? (
							<IconEyeOff className="h-4 w-4" />
						) : (
							<IconEye className="h-4 w-4" />
						)}
					</button>
				</div>
				{errors.password && (
					<FieldError errors={[errors.password]} />
				)}
			</Field>
		</div>
	);
};
