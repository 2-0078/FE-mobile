'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';

interface ModalContainerProps {
  children: ReactNode | ((handleClose: () => void) => ReactNode);
  isOpen: boolean;
  onClose?: () => void;
  withAnimation?: boolean;
}

export function ModalContainer({
  children,
  isOpen,
  withAnimation = true,
  onClose,
}: ModalContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number>(0);
  const currentTouchY = useRef<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // 뒤쪽 페이지 스크롤 비활성화
      document.body.style.overflow = 'hidden';

      // 컴포넌트가 마운트된 후 애니메이션 시작
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    }

    return () => {
      if (!isOpen) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      document.body.style.overflow = 'unset';
      setIsVisible(false);
      setIsClosing(false);
      setDragDistance(0);
      onClose?.();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const modalTop = modalRef.current?.getBoundingClientRect().top || 0;
    const dragHandleHeight = 50; // 상단 50px 영역에서만 드래그 허용

    // 모달 상단 영역에서만 드래그 시작 허용
    if (touchY - modalTop > dragHandleHeight) {
      return;
    }

    touchStartY.current = touchY;
    currentTouchY.current = touchY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    currentTouchY.current = e.touches[0].clientY;
    const distance = currentTouchY.current - touchStartY.current;

    // 아래로 드래그할 때만 반응 (양수 값)
    if (distance > 0) {
      setDragDistance(distance);
      e.preventDefault(); // 스크롤 방지
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const distance = currentTouchY.current - touchStartY.current;
    const threshold = 150; // 150px 이상 드래그하면 닫기

    if (distance > threshold) {
      handleClose();
    } else {
      // 임계값에 도달하지 않으면 원래 위치로 복원
      setDragDistance(0);
    }

    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out backdrop-blur-sm ${
        withAnimation
          ? isClosing
            ? 'translate-y-full'
            : isVisible
              ? 'translate-y-0'
              : 'translate-y-full'
          : ''
      }`}
      style={{
        backgroundColor: isDragging
          ? `rgba(0, 0, 0, ${Math.max(0.1, 0.5 - dragDistance / 300)})`
          : 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="h-full mt-20 rounded-t-3xl overflow-hidden bg-white flex flex-col"
        style={{
          transform: isDragging
            ? `translateY(${dragDistance}px) scale(${Math.max(0.95, 1 - dragDistance / 1000)})`
            : 'translateY(0) scale(1)',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        <div className="flex-1 overflow-hidden">
          {typeof children === 'function' ? children(handleClose) : children}
        </div>
      </div>
    </div>
  );
}
