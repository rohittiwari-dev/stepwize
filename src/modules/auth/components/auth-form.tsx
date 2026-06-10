'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
	IconArrowRight,
	IconLoader2,
	IconShieldLock,
} from '@tabler/icons-react';
import { StepwizeLogo } from '@/components/icons/stepwize-logo';
import { authClient } from '@/lib/auth/clients';
import { Button } from '@/components/ui/button';
import type { AuthMode } from '@/modules/auth/types';
import { getAuthSchema, type AuthFormValues } from '@/modules/auth/validations';
import { AuthFormHeader } from './ui/auth-form-header';
import { AuthFormFields } from './ui/auth-form-fields';
import { AuthFormSocial } from './ui/auth-form-social';

interface AuthFormProps {
	type?: AuthMode;
	show_logo?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export const AuthForm = ({ type = 'sign-in', show_logo }: AuthFormProps) => {
	const [oauthLoading, setOauthLoading] = useState(false);
	const reduce = useReducedMotion();

	const schema = useMemo(() => getAuthSchema(type), [type]);

	const form = useForm<AuthFormValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: '', email: '', password: '' },
		mode: 'onTouched',
	});

	const { isSubmitting } = form.formState;

	// ── Stagger reveal ──

	const container: Variants = {
		hidden: {},
		show: {
			transition: { staggerChildren: 0.07, delayChildren: 0.05 },
		},
	};
	const item: Variants = {
		hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: EASE },
		},
	};

	// ── Submit (RHF manages isSubmitting automatically) ──

	const onSubmit = async (values: AuthFormValues) => {
		try {
			if (type === 'sign-up') {
				const { error } = await authClient.signUp.email({
					email: values.email,
					password: values.password,
					name: values.name,
					callbackURL: '/',
				});
				if (error) {
					toast.error(error.message || 'Sign up failed.');
				} else {
					toast.success('Account created! Check your email to verify.');
				}
			} else {
				const { error } = await authClient.signIn.email({
					email: values.email,
					password: values.password,
					callbackURL: '/',
				});
				if (error) {
					toast.error(error.message || 'Invalid email or password.');
				} else {
					toast.success('Logged in successfully!');
				}
			}
		} catch (err: any) {
			toast.error(err.message || 'An unexpected error occurred.');
		}
	};

	// ── OAuth (separate loading state) ──

	const handleSocialLogin = async (provider: 'google') => {
		setOauthLoading(true);
		try {
			const { error } = await authClient.signIn.social({
				provider,
				callbackURL: '/',
			});

			if (error) {
				toast.error(error.message || `Failed to sign in with ${provider}.`);
				setOauthLoading(false);
			}
			// On success, a redirect happens — loading stays on intentionally
		} catch (err: any) {
			toast.error(err.message || `Failed to sign in with ${provider}.`);
			setOauthLoading(false);
		}
	};

	// ── Render ──

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="relative w-full"
		>
			{/* Mobile-only logo (brand panel is hidden below lg) */}
			<motion.div
				variants={item}
				className="mb-8 flex items-center gap-2.5 lg:hidden"
			>
				<StepwizeLogo className="h-7 w-auto" />
				<span className="text-lg font-bold tracking-tight">Stepwize</span>
			</motion.div>

			<motion.div variants={item}>
				<AuthFormHeader mode={type} show_logo={show_logo} />
			</motion.div>

			<motion.form
				variants={item}
				onSubmit={form.handleSubmit(onSubmit)}
				noValidate
			>
				<AuthFormFields form={form} mode={type} />

				<Button
					type="submit"
					disabled={isSubmitting || oauthLoading}
					className="group mt-6 h-11 w-full rounded-lg shadow-neon hover:scale-[1.01] active:scale-[0.99] transition-transform"
				>
					{isSubmitting ? (
						<IconLoader2 className="size-4 animate-spin" />
					) : (
						<>
							<span>
								{type === 'sign-up'
									? 'Create account'
									: 'Sign in'}
							</span>
							<IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</>
					)}
				</Button>
			</motion.form>

			<motion.div variants={item}>
				<AuthFormSocial
					onSocialLogin={handleSocialLogin}
					isLoading={oauthLoading}
					disabled={isSubmitting}
				/>
			</motion.div>

			{type === 'sign-up' && (
				<motion.p
					variants={item}
					className="mt-5 text-center text-xs leading-relaxed text-muted-foreground"
				>
					By creating an account, you agree to our{' '}
					<Link
						href="/terms"
						className="font-medium text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
					>
						Terms
					</Link>{' '}
					and{' '}
					<Link
						href="/privacy"
						className="font-medium text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
					>
						Privacy Policy
					</Link>
					.
				</motion.p>
			)}

			<motion.p
				variants={item}
				className="mt-6 text-center text-sm text-muted-foreground"
			>
				{type === 'sign-in'
					? "Don't have an account? "
					: 'Already have an account? '}
				<Link
					href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
					className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
				>
					{type === 'sign-in' ? 'Sign up' : 'Sign in'}
				</Link>
			</motion.p>

			<motion.div
				variants={item}
				className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/70"
			>
				<IconShieldLock className="size-3.5" />
				<span>Secured with industry-standard encryption</span>
			</motion.div>
		</motion.div>
	);
};

export default AuthForm;
