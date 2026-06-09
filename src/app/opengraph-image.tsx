import { ImageResponse } from 'next/og';

export const alt = 'Stepwize — Visual Workflow Automation';
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = 'image/png';

export default function OGImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(135deg, #0F0F23 0%, #1a1a3e 50%, #0F0F23 100%)',
					fontFamily: 'sans-serif',
				}}
			>
				{/* Icon mark */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 96,
						height: 96,
						borderRadius: 20,
						background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
						marginBottom: 32,
					}}
				>
					<span
						style={{
							fontSize: 60,
							fontWeight: 800,
							color: 'white',
							lineHeight: 1,
						}}
					>
						S
					</span>
				</div>

				{/* Brand name */}
				<span
					style={{
						fontSize: 64,
						fontWeight: 700,
						color: 'white',
						letterSpacing: '-0.02em',
						marginBottom: 16,
					}}
				>
					Stepwize
				</span>

				{/* Tagline */}
				<span
					style={{
						fontSize: 28,
						color: '#a5a5c0',
						fontWeight: 400,
					}}
				>
					Automate workflows visually — step by step.
				</span>

				{/* Gradient accent line */}
				<div
					style={{
						width: 200,
						height: 4,
						borderRadius: 2,
						background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #A78BFA)',
						marginTop: 40,
						display: 'flex',
					}}
				/>
			</div>
		),
		{ ...size },
	);
}
