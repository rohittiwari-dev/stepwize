import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

export const Meteors = ({
	number = 20,
	className,
}: {
	number?: number;
	className?: string;
}) => {
	const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

	useEffect(() => {
		const styles = [...new Array(number)].map(() => ({
			top: 0,
			left: Math.floor(Math.random() * (400 - -400) + -400) + 'px',
			animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + 's',
			animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + 's',
		}));
		setMeteorStyles(styles);
	}, [number]);

	if (meteorStyles.length === 0) return null;

	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden">
			{meteorStyles.map((style, idx) => (
				<span
					key={'meteor' + idx}
					className={cn(
						'pointer-events-none absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-215 animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]',
						'before:absolute before:top-1/2 before:h-px before:w-[50px] before:translate-y-[-50%] before:bg-linear-to-r before:from-[#64748b] before:to-transparent',
						className,
					)}
					style={style}
				/>
			))}
		</div>
	);
};
