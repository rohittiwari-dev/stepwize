import AuthForm from '@/modules/auth/components/auth-form';
import { AuthBrandPanel } from '@/modules/auth/components/ui/auth-brand-panel';
import { BackgroundGrid } from '@/components/ui/background-grid';
import { Toaster } from '@/components/ui/sonner';

const SignUpPage = () => {
	return (
		<main className="flex h-dvh w-screen overflow-hidden">
			<AuthBrandPanel />

			<div className="relative flex flex-1 items-center justify-center overflow-y-auto bg-background p-6 sm:p-10">
				<BackgroundGrid showGradient={false} />

				<div className="relative z-10 w-full max-w-sm">
					<AuthForm type="sign-up" />
				</div>
			</div>

			<Toaster />
		</main>
	);
};

export default SignUpPage;
