'use client';

import React from 'react';
import AlertButton from '@/components/common/AlertButton';
import MainProfile from '@/components/common/MainProfile';

interface HeaderLayoutProps {
  isLoggedIn: boolean;
  userName?: string;
  userImageUrl?: string;
}

export default function HeaderLayout({ 
  isLoggedIn, 
  userName, 
  userImageUrl 
}: HeaderLayoutProps) {
  return (
    <header className="flex items-center justify-between px-4 pt-4">
      {isLoggedIn ? (
        <MainProfile
          isLoggedIn={true}
          userName={userName}
          userImageUrl={userImageUrl}
        />
      ) : (
        <div className="flex-1" /> // 로그인하지 않은 경우 왼쪽 공간 확보
      )}
      <AlertButton isActive={false} />
    </header>
  );
} 