import React from 'react';
import BackButton from '@/components/common/BackButton';
import TitleWrapper from '@/components/layout/TitleWrapper';
import AlertButton from '@/components/common/AlertButton';
import { cn } from '@/lib/utils';
import CloseButton from '@/components/common/CloseButton';

export default function Header({
  title,
  isAlert = false,
  isBackButton = false,
  isCloseButton = false,
  className,
}: {
  title?: string;
  isAlert?: boolean;
  isBackButton?: boolean;
  isCloseButton?: boolean;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-black/5 backdrop-blur-sm px-5 pt-8 pb-4 flex justify-between items-center w-full',
        className
      )}
    >
      {isBackButton && <BackButton />}

      <TitleWrapper className="text-xl text-center">{title}</TitleWrapper>
      {isCloseButton && <CloseButton />}
      {isAlert && <AlertButton />}
    </header>
  );
}
