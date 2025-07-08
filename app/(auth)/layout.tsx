'use client';

import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import { usePathname } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();

  const getTitle = () => {
    switch (pathname) {
      case '/login':
        return 'LOGIN';
      case '/signup':
        return 'SIGN UP';
      default:
        return 'AUTH';
    }
  };

  return (
    <PageWrapper>
      <Header title={getTitle()} isCloseButton={true} />
      {children}
    </PageWrapper>
  );
}
