import { ImageResponse } from 'next/og';

export const size = {
	width: 180,
	height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(135deg, #0F0A1A 0%, #1A0F2E 100%)',
					borderRadius: 32,
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 50 39"
					fill="none"
					width={120}
					height={94}
					style={{ display: 'flex' }}
				>
					<path
						d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
						fill="#A855F7"
					/>
					<path
						d="M17.4231 27.1022L11.4199 36.0002H33.5015L49.0007 13.0273H32.7031L23.2071 27.1022H17.4231Z"
						fill="#6366F1"
					/>
				</svg>
			</div>
		),
		{ ...size },
	);
}

