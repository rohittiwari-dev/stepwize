'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="w-9 h-9" />;
	}

	const isDark = resolvedTheme === 'dark';

	return (
		<Button
			variant="ghost"
			size="icon-lg"
			className="h-9 w-9 rounded-lg hover:bg-muted/65 text-muted-foreground hover:text-foreground"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			aria-label="Toggle theme"
		>
			{isDark ? (
				<IconSun className="size-[18px] transition-all" />
			) : (
				<IconMoon className="size-[18px] transition-all" />
			)}
		</Button>
	);
};
