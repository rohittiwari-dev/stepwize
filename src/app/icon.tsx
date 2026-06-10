import { ImageResponse } from 'next/og';

export const size = {
	width: 32,
	height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'transparent',
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 50 39"
					fill="none"
					width={32}
					height={25}
					style={{ display: 'flex' }}
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
			</div>
		),
		{ ...size },
	);
}

