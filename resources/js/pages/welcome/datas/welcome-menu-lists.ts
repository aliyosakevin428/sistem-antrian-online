import { NavItem } from '@/types';
import { Home, TicketPlus, UserSquare } from 'lucide-react';

export const welcomeMenuList: NavItem[] = [
  {
    title: 'Homepage',
    href: route('home'),
    icon: Home,
  },
  {
    title: 'About',
    href: route('about'),
    icon: UserSquare,
  },
  {
    title: 'Ambil Antrian',
    href: route('queue.take.page'),
    icon: TicketPlus,
  },
];
