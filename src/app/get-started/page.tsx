import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { OnboardingWizard } from '@/features/onboarding/components/onboarding-wizard';

export const metadata = {
	title: 'Get Started',
	description: 'Set up your Stepwize workspace',
};

export default async function GetStartedPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect('/sign-in');
	}

	const membership = await prisma.member.findFirst({
		where: { userId: session.user.id },
	});

	if (membership) {
		redirect('/dashboard');
	}

	return <OnboardingWizard />;
}
