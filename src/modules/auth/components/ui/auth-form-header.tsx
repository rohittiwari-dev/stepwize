import { IconBolt } from '@tabler/icons-react';
import type { AuthMode } from '@/modules/auth/types';

interface AuthFormHeaderProps {
	mode: AuthMode;
	show_logo?: boolean;
}

const COPY = {
	'sign-in': {
		title: 'Welcome back',
		subtitle: 'Sign in to your Stepwize account.',
	},
	'sign-up': {
		title: 'Create an account',
		subtitle: 'Get started with Stepwize for free.',
	},
} as const;

export const AuthFormHeader = ({
	mode,
	show_logo = false,
}: AuthFormHeaderProps) => {
	const { title, subtitle } = COPY[mode];

	return (
		<div className="mb-6">
			{show_logo && (
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
					<IconBolt className="h-5 w-5 text-primary" />
				</div>
			)}
			<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
			<p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
		</div>
	);
};
