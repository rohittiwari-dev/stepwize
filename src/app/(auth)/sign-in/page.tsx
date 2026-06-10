import AuthForm from '@/features/auth/components/auth-form';
import { AuthBrandPanel } from '@/features/auth/components/ui/auth-brand-panel';
import { BackgroundGrid } from '@/components/ui/background-grid';

const SignInPage = () => {
	return (
		<main className="flex h-dvh w-screen overflow-hidden">
			<AuthBrandPanel />

			<div className="relative flex flex-1 items-center justify-center overflow-y-auto bg-background p-6 sm:p-10">
				<BackgroundGrid showGradient={false} />

				<div className="relative z-10 w-full max-w-sm">
					<AuthForm type="sign-in" />
				</div>
			</div>
		</main>
	);
};

export default SignInPage;
