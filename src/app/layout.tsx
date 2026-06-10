import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../orpc/server';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const SITE_URL = process.env.BETTER_AUTH_URL ?? 'https://stepwize.netlify.app';

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: 'Stepwize — Visual Workflow Automation',
		template: '%s | Stepwize',
	},
	description:
		'Stepwize is a powerful visual workflow automation platform. Connect apps, automate tasks, and build complex workflows with an intuitive drag-and-drop editor — no code required.',
	keywords: [
		'workflow automation',
		'automation platform',
		'n8n alternative',
		'no-code automation',
		'task automation',
		'app integrations',
		'workflow builder',
		'API orchestration',
		'stepwize',
	],

	authors: [{ name: 'Stepwize' }],
	creator: 'Stepwize',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: SITE_URL,
		siteName: 'Stepwize',
		title: 'Stepwize — Visual Workflow Automation',
		description:
			'Connect your apps and automate workflows visually. Build powerful automations with a drag-and-drop editor — no code required.',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Stepwize — Visual Workflow Automation',
		description:
			'Connect your apps and automate workflows visually. Build powerful automations with a drag-and-drop editor — no code required.',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-background`}
			suppressHydrationWarning
		>
			<body
				className="min-h-full flex flex-col bg-background"
				suppressHydrationWarning
			>
				{/* <ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				> */}
				{children}
				{/* </ThemeProvider> */}
			</body>
		</html>
	);
}
