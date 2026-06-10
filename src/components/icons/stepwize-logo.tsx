import type { SVGProps } from 'react';

export const StepwizeLogo = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 50 39"
		fill="none"
		{...props}
	>
		<defs>
			<linearGradient
				id="neon-grad-1"
				x1="0%"
				y1="0%"
				x2="100%"
				y2="100%"
			>
				<stop offset="0%" stopColor="#A855F7" /> {/* Purple 500 */}
				<stop offset="100%" stopColor="#8B5CF6" /> {/* Violet 500 */}
			</linearGradient>
			<linearGradient
				id="neon-grad-2"
				x1="0%"
				y1="100%"
				x2="100%"
				y2="0%"
			>
				<stop offset="0%" stopColor="#8B5CF6" /> {/* Violet 500 */}
				<stop offset="100%" stopColor="#6366F1" /> {/* Indigo 500 */}
			</linearGradient>
		</defs>
		<path
			d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
			fill="url(#neon-grad-1)"
		/>
		<path
			d="M17.4231 27.1022L11.4199 36.0002H33.5015L49.0007 13.0273H32.7031L23.2071 27.1022H17.4231Z"
			fill="url(#neon-grad-2)"
		/>
	</svg>
);
