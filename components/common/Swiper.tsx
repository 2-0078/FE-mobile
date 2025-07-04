'use client';

import React from 'react';
import {
  useSwiper,
  getSwiperStyles,
  renderIndicators,
} from '@/lib/swiper-utils';

interface SwiperProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  config?: {
    autoPlayInterval?: number;
    threshold?: number;
    gap?: number;
  };
  className?: string;
  itemClassName?: string;
  showIndicators?: boolean;
}

export default function Swiper<T>({
  items,
  renderItem,
  config = {},
  className = '',
  itemClassName = '',
  showIndicators = true,
}: SwiperProps<T>) {
  const [state, handlers, containerRef] = useSwiper(items.length, config);

  const handleIndicatorClick = (index: number) => {
    handlers.setCurrentIndex(index);
  };

  if (items.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <ul
        ref={containerRef}
        className="flex gap-[16px] cursor-grab active:cursor-grabbing"
        onTouchStart={handlers.handleTouchStart}
        onTouchMove={handlers.handleTouchMove}
        onTouchEnd={handlers.handleTouchEnd}
        onMouseDown={handlers.handleMouseDown}
        onMouseMove={handlers.handleMouseMove}
        onMouseUp={handlers.handleMouseUp}
        onMouseLeave={handlers.handleMouseLeave}
        style={{
          userSelect: 'none',
          touchAction: 'pan-y pinch-zoom',
        }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={`w-full flex-shrink-0 transition-transform duration-500 ease-in-out ${itemClassName}`}
            style={getSwiperStyles(state, containerRef, config.gap || 16)}
          >
            {renderItem(item, index)}
          </li>
        ))}
      </ul>

      {/* 인디케이터 */}
      {showIndicators &&
        renderIndicators(
          items.length,
          state.currentIndex,
          handleIndicatorClick
        )}
    </div>
  );
}
