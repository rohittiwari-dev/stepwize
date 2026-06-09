import AuthForm from '@/modules/auth/components/auth-form';
import React from 'react';

const SignInPage = () => {
	return (
		<main className="flex h-screen w-full items-center justify-center bg-gray-100 relative">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-gray-400 to-gray-600 z-10" />
			<AuthForm type="sign-in" />
		</main>
	);
};

export default SignInPage;
