'use client';

import { StepwizeLogo } from '@/components/icons/stepwize-logo';

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

import {
	SidebarHeader as SidebarHeaderLayout,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { IconSearch } from '@tabler/icons-react';

const SidebarHeader = () => {
	const { open, setOpen } = useSidebar();
	return (
		<SidebarHeaderLayout>
			<SidebarMenu className={cn(!open && 'gap-2')}>
				<SidebarMenuItem>
					<SidebarMenuButton
						size="lg"
						render={<div />}
						className="bg-transparent! border-none! hover:bg-transparent! justify-between cursor-pointer"
						onClick={() => {
							if (!open) {
								setOpen(true);
							}
						}}
					>
						<div className="flex items-center gap-2">
							<div
								className={cn(
									'flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-secondary text-sidebar-primary-foreground',
									!open && 'group/icon hover:bg-primary!',
								)}
							>
								<StepwizeLogo
									className={cn(
										'transition-all duration-300 ease-in-out',
										!open &&
											'group-hover/icon:brightness-0 group-hover/icon:invert',
										open && 'w-8! h-8!',
									)}
								/>
							</div>
							<div className="flex flex-col gap-0.5 text-lg leading-none">
								<span className="font-semibold bg-linear-to-r from-purple-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
									Stepwize
								</span>
								<span className="font-light text-xs text-slate-400">
									Life made simple
								</span>
							</div>
						</div>
						<SidebarTrigger className="text-sidebar-primary hover:bg-primary! hover:text-primary-foreground!" />
					</SidebarMenuButton>
				</SidebarMenuItem>

				<InputGroup>
					<InputGroupAddon>
						<IconSearch />
					</InputGroupAddon>
					<InputGroupInput placeholder="Search..." />

					<InputGroupAddon align={'inline-end'}>
						<KbdGroup>
							<Kbd>Ctrl</Kbd>
							<Kbd>/</Kbd>
						</KbdGroup>
					</InputGroupAddon>
				</InputGroup>
			</SidebarMenu>
		</SidebarHeaderLayout>
	);
};

export default SidebarHeader;
