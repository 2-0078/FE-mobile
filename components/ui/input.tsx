import * as React from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean;
  success?: boolean;
  variant?: 'default' | 'filled' | 'outline';
}

function Input({
  className,
  type,
  error = false,
  success = false,
  variant = 'default',
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // 기본 스타일
        'flex h-12 w-full min-w-0 rounded-lg border bg-transparent px-4 py-3 text-base',
        'transition-all duration-200 ease-in-out',
        'placeholder:text-custom-gray-200',
        'focus:outline-none focus:ring-2 focus:ring-custom-green/20 focus:border-custom-green',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',

        // variant 스타일
        variant === 'default' && 'border-custom-gray-300 bg-white',
        variant === 'filled' && 'border-custom-gray-200 bg-custom-gray-50',
        variant === 'outline' &&
          'border-2 border-custom-gray-300 bg-transparent',

        // 상태별 스타일
        error &&
          'border-red-500 bg-red-50 text-red-600 focus:ring-red-500/20 focus:border-red-500',
        success &&
          'border-custom-green bg-custom-green/5 text-custom-green focus:ring-custom-green/20 focus:border-custom-green',

        // aria-invalid 스타일
        'aria-invalid:border-red-500 aria-invalid:bg-red-50 aria-invalid:text-red-600',

        className
      )}
      {...props}
    />
  );
}

export { Input };
