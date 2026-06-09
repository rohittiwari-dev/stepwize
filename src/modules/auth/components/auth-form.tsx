'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { IconArrowRight, IconLoader2 } from '@tabler/icons-react';
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

export const AuthForm = ({ type = 'sign-in', show_logo }: AuthFormProps) => {
	const [oauthLoading, setOauthLoading] = useState(false);

	const schema = useMemo(() => getAuthSchema(type), [type]);

	const form = useForm<AuthFormValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: '', email: '', password: '' },
		mode: 'onTouched',
	});

	const { isSubmitting } = form.formState;

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
					toast.success(
						'Account created! Check your email to verify.',
					);
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
				console.log(error);
				toast.error(
					error.message || `Failed to sign in with ${provider}.`,
				);
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
		<div className="w-full max-w-sm">
			<AuthFormHeader mode={type} show_logo={show_logo} />

			<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
				<AuthFormFields form={form} mode={type} />

				<Button
					type="submit"
					disabled={isSubmitting || oauthLoading}
					className="w-full h-10 mt-5"
				>
					{isSubmitting ? (
						<IconLoader2 className="h-4 w-4 animate-spin" />
					) : (
						<>
							<span>
								{type === 'sign-up'
									? 'Create account'
									: 'Sign in'}
							</span>
							<IconArrowRight className="h-4 w-4" />
						</>
					)}
				</Button>
			</form>

			<AuthFormSocial
				onSocialLogin={handleSocialLogin}
				isLoading={oauthLoading}
				disabled={isSubmitting}
			/>

			<p className="mt-6 text-center text-sm text-muted-foreground">
				{type === 'sign-in'
					? "Don't have an account? "
					: 'Already have an account? '}
				<Link
					href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
					className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
				>
					{type === 'sign-in' ? 'Sign up' : 'Sign in'}
				</Link>
			</p>
		</div>
	);
};

export default AuthForm;
