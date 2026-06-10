import { StepwizeLogo } from '@/components/icons/stepwize-logo';
import type { AuthMode } from '@/features/auth/types';

interface AuthFormHeaderProps {
	mode: AuthMode;
	show_logo?: boolean;
}

const COPY = {
	'sign-in': {
		eyebrow: 'Welcome back',
		title: 'Sign in to Stepwize',
		subtitle: 'Pick up right where your workflows left off.',
	},
	'sign-up': {
		eyebrow: 'Get started free',
		title: 'Create your account',
		subtitle: 'Build your first automation in minutes — no card required.',
	},
} as const;

export const AuthFormHeader = ({
	mode,
	show_logo = false,
}: AuthFormHeaderProps) => {
	const { eyebrow, title, subtitle } = COPY[mode];

	return (
		<div className="mb-7">
			{show_logo && (
				<div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10">
					<StepwizeLogo className="size-5" />
				</div>
			)}
			<span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
				{eyebrow}
			</span>
			<h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
				{title}
			</h1>
			<p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
		</div>
	);
};
