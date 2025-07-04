import { useState, useEffect, useRef, RefObject } from 'react';
import React from 'react';

export interface SwiperState {
  currentIndex: number;
  isDragging: boolean;
  startX: number;
  currentX: number;
  translateX: number;
}

export interface SwiperConfig {
  autoPlayInterval?: number;
  threshold?: number;
  gap?: number;
}

export interface SwiperHandlers {
  handleStart: (clientX: number) => void;
  handleMove: (clientX: number) => void;
  handleEnd: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
  setCurrentIndex: (index: number) => void;
}

export function useSwiper(
  itemsLength: number,
  config: SwiperConfig = {}
): [SwiperState, SwiperHandlers, RefObject<HTMLUListElement | null>] {
  const { autoPlayInterval = 3000, threshold = 0.3, gap = 16 } = config;

  const [state, setState] = useState<SwiperState>({
    currentIndex: 0,
    isDragging: false,
    startX: 0,
    currentX: 0,
    translateX: 0,
  });

  const containerRef = useRef<HTMLUListElement | null>(null);

  // 자동 재생
  useEffect(() => {
    if (itemsLength <= 1) return;

    const interval = setInterval(() => {
      if (!state.isDragging) {
        setState((prev) => ({
          ...prev,
          currentIndex: (prev.currentIndex + 1) % itemsLength,
        }));
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [itemsLength, state.isDragging, autoPlayInterval]);

  // 터치/마우스 시작
  const handleStart = (clientX: number) => {
    setState((prev) => ({
      ...prev,
      isDragging: true,
      startX: clientX,
      currentX: clientX,
    }));
  };

  // 터치/마우스 이동
  const handleMove = (clientX: number) => {
    if (!state.isDragging) return;

    const diff = clientX - state.startX;
    const containerWidth = containerRef.current?.offsetWidth || 0;

    // gap을 퍼센트로 계산
    const gapPercent = containerWidth > 0 ? (gap / containerWidth) * 100 : 4;
    const itemWidthPercent = 100 + gapPercent;

    // gap을 고려한 이동 거리 계산
    const movePercent = (diff / containerWidth) * itemWidthPercent;

    setState((prev) => ({
      ...prev,
      currentX: clientX,
      translateX: movePercent,
    }));
  };

  // 터치/마우스 종료
  const handleEnd = () => {
    if (!state.isDragging) return;

    const diff = state.currentX - state.startX;
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const thresholdPixels = containerWidth * threshold;

    let newIndex = state.currentIndex;

    if (Math.abs(diff) > thresholdPixels) {
      if (diff > 0 && state.currentIndex > 0) {
        // 오른쪽으로 스와이프 - 이전 아이템
        newIndex = state.currentIndex - 1;
      } else if (diff < 0 && state.currentIndex < itemsLength - 1) {
        // 왼쪽으로 스와이프 - 다음 아이템
        newIndex = state.currentIndex + 1;
      }
    }

    setState((prev) => ({
      ...prev,
      isDragging: false,
      translateX: 0,
      currentIndex: newIndex,
    }));
  };

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    // 터치 이벤트의 기본 동작을 막지 않음
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!state.isDragging) return;
    // passive event listener와 충돌을 피하기 위해 preventDefault 제거
    // 대신 스크롤 방지를 위해 CSS로 처리
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    // 터치 이벤트의 기본 동작을 막지 않음
    handleEnd();
  };

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!state.isDragging) return;
    e.preventDefault();
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // 마우스가 컨테이너를 벗어날 때
  const handleMouseLeave = () => {
    if (state.isDragging) {
      handleEnd();
    }
  };

  const setCurrentIndex = (index: number) => {
    setState((prev) => ({
      ...prev,
      currentIndex: index,
    }));
  };

  const handlers: SwiperHandlers = {
    handleStart,
    handleMove,
    handleEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    setCurrentIndex,
  };

  return [state, handlers, containerRef];
}

// 스타일 계산 유틸리티
export function getSwiperStyles(
  state: SwiperState,
  containerRef: RefObject<HTMLUListElement | null>,
  gap: number = 16
) {
  const containerWidth = containerRef.current?.offsetWidth || 0;
  const gapPercent = containerWidth > 0 ? (gap / containerWidth) * 100 : 4;
  const itemWidthPercent = 100 + gapPercent;

  return {
    transform: state.isDragging
      ? `translateX(calc(-${state.currentIndex * itemWidthPercent}% + ${state.translateX}px))`
      : `translateX(calc(-${state.currentIndex * itemWidthPercent}%))`,
    userSelect: 'none' as const,
  };
}

// 인디케이터 렌더링 유틸리티
export function renderIndicators(
  itemsLength: number,
  currentIndex: number,
  onIndicatorClick: (index: number) => void
): React.ReactElement | null {
  if (itemsLength <= 1) return null;

  return React.createElement(
    'div',
    { className: 'flex justify-center items-center mt-4 space-x-2' },
    Array.from({ length: itemsLength }).map((_, index) =>
      React.createElement('button', {
        key: index,
        className: `w-1 h-1 rounded-full transition-colors transition-all duration-300 ${
          index === currentIndex
            ? 'bg-custom-green w-4 h-4'
            : 'bg-gray-300 opacity-50'
        }`,
        onClick: () => onIndicatorClick(index),
      })
    )
  );
}
