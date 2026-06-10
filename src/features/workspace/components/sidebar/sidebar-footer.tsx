import { SidebarFooter as SidebarFooterPrimitives } from '@/components/ui/sidebar';
import UserControl from '@/features/auth/components/user-control';

const SidebarFooter = () => {
	return (
		<SidebarFooterPrimitives>
			<UserControl />
		</SidebarFooterPrimitives>
	);
};

export default SidebarFooter;
