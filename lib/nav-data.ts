import { ChartColumn, LucideIcon, User2, Wallet2Icon } from 'lucide-react';
import { Puzzle } from 'lucide-react';
import CardIcon from '@/repo/ui/Icons/CardIcon';
import HomeIcon from '@/repo/ui/Icons/HomeIcon';
import MyPageIcon from '@/repo/ui/Icons/MyPageIcon';
import OtherIcon from '@/repo/ui/Icons/OtherIcon';

export interface NavItem {
  href: string;
  icon: React.ComponentType<{ isActive?: boolean }> | LucideIcon;
  isSpecial?: boolean;
  label: string;
}

export const navItems: NavItem[] = [
  {
    href: '/',
    icon: HomeIcon,
    label: '홈',
  },
  {
    href: '/funding',
    icon: ChartColumn,
    label: '펀딩',
  },
  {
    href: '/mywallet',
    icon: Wallet2Icon,
    label: '내 지갑',
    isSpecial: true,
  },
  {
    href: '/piece',
    icon: Puzzle,
    label: '조각',
  },
  {
    href: '/other',
    icon: User2,
    label: '기타',
  },
];
