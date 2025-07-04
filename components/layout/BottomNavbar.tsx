'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { navItems } from '@/lib/nav-data';
import NavItem from './NavItem';

// throttle 함수
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export default function BottomNavbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const autoShowTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);

  const resetAutoShowTimer = useCallback(() => {
    // 기존 타이머가 있다면 클리어
    if (autoShowTimeoutRef.current) {
      clearTimeout(autoShowTimeoutRef.current);
    }

    // 하단바가 숨겨져 있을 때만 타이머 설정
    if (!isVisible) {
      autoShowTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 1000); // 1초 후 자동 표시
    }
  }, [isVisible]);

  const handleScroll = useCallback(
    throttle(() => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();

      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 아래로 스크롤하고 100px 이상 스크롤된 경우 숨기기
        setIsVisible(false);
        // 자동 표시 타이머 시작
        resetAutoShowTimer();
      } else if (currentScrollY < lastScrollY) {
        // 위로 스크롤하는 경우 보이기
        setIsVisible(true);
        // 자동 표시 타이머 클리어
        if (autoShowTimeoutRef.current) {
          clearTimeout(autoShowTimeoutRef.current);
          autoShowTimeoutRef.current = null;
        }
      }

      setLastScrollY(currentScrollY);
      lastScrollTimeRef.current = currentTime;
    }, 100), // 100ms throttle
    [lastScrollY, resetAutoShowTimer]
  );

  // 마우스 움직임, 터치, 키보드 입력 감지
  const handleUserActivity = useCallback(() => {
    if (!isVisible) {
      resetAutoShowTimer();
    }
  }, [isVisible, resetAutoShowTimer]);

  // 스크롤이 멈췄는지 확인하는 함수
  const checkScrollStopped = useCallback(() => {
    const currentTime = Date.now();
    const timeSinceLastScroll = currentTime - lastScrollTimeRef.current;

    // 마지막 스크롤 후 1초가 지났고, 하단바가 숨겨져 있다면 보이기
    if (timeSinceLastScroll >= 1000 && !isVisible) {
      setIsVisible(true);
      if (autoShowTimeoutRef.current) {
        clearTimeout(autoShowTimeoutRef.current);
        autoShowTimeoutRef.current = null;
      }
    }
  }, [isVisible]);

  useEffect(() => {
    // 스크롤이 멈췄는지 주기적으로 확인
    const scrollCheckInterval = setInterval(checkScrollStopped, 500);

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 사용자 활동 감지 이벤트 리스너 추가
    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, {
      passive: true,
    });
    window.addEventListener('keydown', handleUserActivity, { passive: true });

    // 클린업 함수
    return () => {
      clearInterval(scrollCheckInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);

      // 타이머 클리어
      if (autoShowTimeoutRef.current) {
        clearTimeout(autoShowTimeoutRef.current);
      }
    };
  }, [handleScroll, handleUserActivity, checkScrollStopped]);

  return (
    <nav
      className={`w-full fixed -bottom-0.5 left-0 right-0 px-4 bg-black h-20 flex items-center z-50 transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <ul className="flex flex-1 justify-between items-center w-full">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </ul>
    </nav>
  );
}
