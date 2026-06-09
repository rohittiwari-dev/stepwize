import AuthForm from '@/modules/auth/components/auth-form';
import { AuthBrandPanel } from '@/modules/auth/components/ui/auth-brand-panel';
import { BackgroundGrid } from '@/components/ui/background-grid';
import { Toaster } from '@/components/ui/sonner';

const SignUpPage = () => {
	return (
		<main className="flex h-dvh">
			<AuthBrandPanel />

			<div className="relative flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-10">
				<BackgroundGrid showGradient={false} />
				<AuthForm type="sign-up" />
			</div>

			<Toaster />
		</main>
	);
};

export default SignUpPage;
