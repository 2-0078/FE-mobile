import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Skeleton({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = 'md',
}: SkeletonProps) {
  const roundedClass = {
    'none': '',
    'sm': 'rounded-sm',
    'md': 'rounded',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-full',
  }[rounded];

  return (
    <div
      className={cn(
        'bg-gray-700 animate-pulse',
        width,
        height,
        roundedClass,
        className
      )}
    />
  );
}

// 자주 사용되는 스켈레톤 변형들
export function TextSkeleton({
  className = '',
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} height="h-4" />
      ))}
    </div>
  );
}

export function ButtonSkeleton({
  className = '',
  width = 'w-24',
}: {
  className?: string;
  width?: string;
}) {
  return <Skeleton className={className} width={width} height="h-10" />;
}

export function CardSkeleton({
  className = '',
  height = 'h-64',
}: {
  className?: string;
  height?: string;
}) {
  return <Skeleton className={className} height={height} rounded="2xl" />;
}

export function AmountSkeleton({ className = '' }: { className?: string }) {
  return <Skeleton className={className} height="h-16" />;
}
