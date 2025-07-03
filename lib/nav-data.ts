import { LucideIcon } from 'lucide-react';
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
    icon: CardIcon,
    label: '펀딩',
  },
  {
    href: '/piece',
    icon: Puzzle,
    isSpecial: true,
    label: '조각',
  },
  {
    href: '/mywallet',
    icon: MyPageIcon,
    label: '내 지갑',
  },
  {
    href: '/other',
    icon: OtherIcon,
    label: '기타',
  },
]; 