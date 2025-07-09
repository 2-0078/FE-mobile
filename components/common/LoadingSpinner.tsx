'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  showText?: boolean;
  text?: string;
  textSize?: 'xs' | 'sm' | 'base' | 'lg';
  className?: string;
}

export default function LoadingSpinner({
  size = 'sm',
  variant = 'spinner',
  showText = false,
  text = 'loading...',
  textSize = 'xs',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-sm',
    lg: 'text-base',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`${sizeClasses[size]} bg-custom-green rounded-full animate-pulse`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`${sizeClasses[size]} bg-custom-green rounded-full animate-pulse`}
          />
        );

      default:
        return (
          <div
            className={`${sizeClasses[size]} border-2 border-gray-300 border-t-custom-green rounded-full animate-spin`}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderSpinner()}
      {showText && (
        <p
          className={`text-white ${textSizeClasses[textSize]} font-medium mt-4`}
        >
          {text}
        </p>
      )}
    </div>
  );
}
