import { z } from 'zod';
import type { AuthMode } from '../types';

// ── Field schemas ──

const emailField = z
	.string()
	.min(1, 'Email is required')
	.email('Please enter a valid email');

export const signUpSchema = z.object({
	name: z.string().min(1, 'Full name is required'),
	email: emailField,
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signInSchema = z.object({
	name: z.string(),
	email: emailField,
	password: z.string().min(1, 'Password is required'),
});

// ── Derived type ──

export type AuthFormValues = z.infer<typeof signUpSchema>;

// ── Schema picker ──

export const getAuthSchema = (mode: AuthMode) =>
	mode === 'sign-up' ? signUpSchema : signInSchema;
