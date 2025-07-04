'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { ReactTyped } from 'react-typed';

export default function TitleWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1 className={cn('font-bold text-3xl text-white break-words', className)}>
      {children}
    </h1>
  );
}

// 타이핑 효과가 적용된 타이틀 컴포넌트
export function TypingTitleWrapper({
  titleStrings,
  subtitleString,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}: {
  titleStrings: string[];
  subtitleString?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <section className={cn('flex flex-col gap-2', className)}>
      <ReactTyped
        strings={titleStrings}
        typeSpeed={50}
        backSpeed={30}
        backDelay={1000}
        loop={true}
        className={`text-2xl font-bold ${titleClassName}`}
        cursorChar='<span class="text-white font-thin pl-1">_</span>'
      />
      {subtitleString && (
        <h3 className={cn(subtitleClassName)}>{subtitleString}</h3>
      )}
    </section>
  );
}
