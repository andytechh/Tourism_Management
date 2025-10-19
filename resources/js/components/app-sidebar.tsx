import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Map, Navigation, NotebookPen, Hotel, MessageCircleWarning,  } from 'lucide-react';
import AppLogo from './app-logo';

// Role-based menu config
const menuItems: Record<string, { title: string; href: string; icon: any }[]> = {
    admin: [
        { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
        { title: 'Manage Users', href: '/admin/users', icon: Users },
        { title: 'Manage Destinations', href: '/admin/destinations', icon: Map },
        { title: 'Manage Bookings', href: '/admin/bookings', icon: NotebookPen},
        { title: 'Manage Businesses', href: '/admin/business', icon: Hotel },
        { title: 'Manage Reports', href: '/admin/reports', icon: MessageCircleWarning },
    ],
    staff: [
        { title: 'Dashboard', href: '/staff/dashboard', icon: LayoutGrid },
        { title: 'Bookings', href: '/staff/bookings', icon: Map },
    ],
    tourist: [
        { title: 'Dashboard', href: '/tourist/dashboard', icon: LayoutGrid },
        { title: 'My Trips', href: '/tourist/trips', icon: Map },
        { title: 'My Tours', href: '/tourist/tours', icon:  Navigation},
    ],
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage();
    const role = props.auth?.user?.role || 'tourist'; // fallback if not logged in

    // Map role-based menuItems into NavItem[]
    const mainNavItems: NavItem[] = menuItems[role] || [];

    return (
        <Sidebar collapsible="icon" variant="inset" className='text-accent-foreground'>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className='text-accent-foreground-'>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
