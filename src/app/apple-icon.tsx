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
					background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
					borderRadius: 32,
				}}
			>
				<span
					style={{
						fontSize: 120,
						fontWeight: 800,
						color: 'white',
						lineHeight: 1,
					}}
				>
					S
				</span>
			</div>
		),
		{ ...size },
	);
}
