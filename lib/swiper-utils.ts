import { useState, useEffect, useRef, RefObject, useCallback } from 'react';
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
  const { autoPlayInterval = 3000, threshold = 0.05, gap = 16 } = config;

  const [state, setState] = useState<SwiperState>({
    currentIndex: 0,
    isDragging: false,
    startX: 0,
    currentX: 0,
    translateX: 0,
  });

  const containerRef = useRef<HTMLUListElement | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

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
  const handleStart = useCallback((clientX: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setState((prev) => ({
      ...prev,
      isDragging: true,
      startX: clientX,
      currentX: clientX,
      translateX: 0,
    }));
  }, []);

  // 터치/마우스 이동 - requestAnimationFrame으로 최적화
  const handleMove = useCallback(
    (clientX: number) => {
      if (!state.isDragging) return;

      animationFrameRef.current = requestAnimationFrame(() => {
        const diff = clientX - state.startX;
        const containerWidth = containerRef.current?.offsetWidth || 0;

        // gap을 퍼센트로 계산
        const gapPercent =
          containerWidth > 0 ? (gap / containerWidth) * 100 : 4;
        const itemWidthPercent = 100 + gapPercent;

        // gap을 고려한 이동 거리 계산
        const movePercent = (diff / containerWidth) * itemWidthPercent;

        setState((prev) => ({
          ...prev,
          currentX: clientX,
          translateX: movePercent,
        }));
      });
    },
    [state.isDragging, state.startX, gap]
  );

  // 터치/마우스 종료
  const handleEnd = useCallback(() => {
    if (!state.isDragging) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

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
  }, [
    state.isDragging,
    state.currentX,
    state.startX,
    state.currentIndex,
    threshold,
    itemsLength,
  ]);

  // 터치 이벤트 - passive 이벤트로 최적화
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientX);
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!state.isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [state.isDragging, handleMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // 마우스 이벤트
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX);
    },
    [handleStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!state.isDragging) return;
      e.preventDefault();
      handleMove(e.clientX);
    },
    [state.isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // 마우스가 컨테이너를 벗어날 때
  const handleMouseLeave = useCallback(() => {
    if (state.isDragging) {
      handleEnd();
    }
  }, [state.isDragging, handleEnd]);

  const setCurrentIndex = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      currentIndex: index,
    }));
  }, []);

  // cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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

// 스타일 계산 유틸리티 - 하드웨어 가속 적용
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
      : `translateX(-${state.currentIndex * itemWidthPercent}%)`,
    transition: state.isDragging
      ? 'none'
      : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    perspective: '1000px',
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
