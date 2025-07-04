import { cn } from '@/lib/utils';
import React from 'react';
import TypewriterText from '@/components/common/TypewriterText';

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
  text,
  speed = 100,
  delay = 0,
  className,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <h1 className={cn('font-bold text-3xl text-white break-words', className)}>
      <TypewriterText text={text} speed={speed} delay={delay} />
    </h1>
  );
}
