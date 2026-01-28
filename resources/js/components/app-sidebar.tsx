import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRightLeft, BookOpen, BookOpenCheck, Building2, Database, KeySquare, LayoutGrid, ListOrdered, Settings, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: route('dashboard'),
    icon: LayoutGrid,
  },
  {
    title: 'Documentation',
    href: route('documentation'),
    icon: BookOpen,
  },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
  const { menus } = usePage<{ menus: Record<string, boolean> }>().props;
  // configure menus "available" in HandleInertiaRequest.php

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="space-y-4">
        <NavMain
          items={[
            ...mainNavItems,
            {
              title: 'Daftar Layanan',
              href: route('service.index'),
              icon: BookOpenCheck,
              available: menus.service,
            },
          ]}
          label="Dashboard"
        />
        <NavMain
          items={[
            {
              title: 'Pengaturan Antrian',
              href: route('queue-setting.index'),
              icon: Database,
              available: menus.queue_setting,
            },
            {
              title: 'Daftar Antrian',
              href: route('queue.index'),
              icon: ListOrdered,
              available: menus.queue,
            },
            {
              title: 'Daftar Loket',
              href: route('counter.index'),
              icon: Building2,
              available: menus.counter,
            },
            {
              title: 'Antrian Dipanggil',
              href: route('queue_calls.index'),
              icon: ArrowRightLeft,
              available: menus.queue_call,
            },
          ]}
          label="Antrian"
        />
        <NavMain
          items={[
            {
              title: 'User management',
              href: route('user.index'),
              icon: Users,
              available: menus.user,
            },
            {
              title: 'Role & permission',
              href: route('role.index'),
              icon: KeySquare,
              available: menus.role,
            },
            {
              title: 'Adminer database',
              href: '/adminer',
              icon: Database,
              available: menus.adminer,
            },
            {
              title: 'Pengaturan profile',
              href: '',
              icon: Settings,
              items: [
                {
                  title: 'Edit profile',
                  href: route('profile.edit'),
                },
                {
                  title: 'Ganti password',
                  href: route('password.edit'),
                },
                {
                  title: 'Appearance',
                  href: route('appearance'),
                },
              ],
            },
          ]}
          label="Settings"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
