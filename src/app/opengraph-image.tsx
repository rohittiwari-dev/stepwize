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
					background: 'linear-gradient(135deg, #0A1628 0%, #0F1D36 50%, #0A1628 100%)',
					fontFamily: 'sans-serif',
				}}
			>
				{/* Icon mark */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 50 39"
					fill="none"
					width={120}
					height={94}
					style={{ marginBottom: 32, display: 'flex' }}
				>
					<path
						d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
						fill="#007AFF"
					/>
					<path
						d="M17.4231 27.1022L11.4199 36.0002H33.5015L49.0007 13.0273H32.7031L23.2071 27.1022H17.4231Z"
						fill="#312ECB"
					/>
				</svg>

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
						background: 'linear-gradient(90deg, #007AFF, #312ECB, #007AFF)',
						marginTop: 40,
						display: 'flex',
					}}
				/>
			</div>
		),
		{ ...size },
	);
}
