import { BackgroundGrid } from '@/components/ui/background-grid';

export default function GetStartedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="relative flex min-h-dvh w-screen items-center justify-center overflow-hidden bg-background">
			{/* Ambient gradient orbs using design tokens */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute left-[-200px] top-[-200px] size-[500px] rounded-full bg-primary opacity-30 blur-[120px] animate-[float-orb_14s_ease-in-out_infinite]" />
				<div className="absolute bottom-[-150px] right-[-150px] size-[400px] rounded-full bg-primary opacity-20 blur-[100px] animate-[float-orb_18s_ease-in-out_infinite_reverse]" />
				<div className="absolute left-1/2 top-1/3 size-[300px] -translate-x-1/2 rounded-full bg-primary opacity-25 blur-[100px] animate-[float-orb_20s_ease-in-out_infinite_3s]" />
			</div>

			<BackgroundGrid showGradient={false} />

			{/* Content */}
			<div className="relative z-10 w-full max-w-[460px] px-5 py-10">
				{children}
			</div>

			<style>{`
				@keyframes float-orb {
					0%, 100% { transform: translate(0, 0) scale(1); }
					33% { transform: translate(30px, -20px) scale(1.05); }
					66% { transform: translate(-20px, 15px) scale(0.95); }
				}
			`}</style>
		</main>
	);
}
