'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.ComponentProps<'input'> {
  label: string;
  error?: boolean;
  success?: boolean;
  required?: boolean;
  helperText?: string;
}

export function FloatingInput({
  label,
  error = false,
  success = false,
  required = false,
  helperText,
  className,
  id,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  return (
    <div className="relative w-full">
      <input
        id={id}
        className={cn(
          // 기본 스타일
          'peer w-full h-14 px-4 pt-6 pb-2 text-base font-medium text-white',
          'border border-custom-gray-300 rounded-lg bg-background',
          'transition-all duration-200 ease-in-out',
          'placeholder:text-transparent',
          'focus:outline-none focus:ring-2 focus:ring-custom-green/20 focus:border-custom-green',
          'disabled:cursor-not-allowed disabled:opacity-50',

          // 상태별 스타일
          error &&
            'border-red-500 bg-background text-white focus:ring-red-500/20 focus:border-red-500',
          success &&
            'border-custom-green text-custom-green focus:ring-custom-green/20 focus:border-custom-green',

          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        autoComplete="off"
        {...props}
      />

      <label
        htmlFor={id}
        className={cn(
          'absolute left-4 transition-all duration-200 ease-in-out pointer-events-none',
          'text-base font-medium',

          // 기본 상태
          !isFocused && !hasValue && 'top-4 text-custom-gray-400',

          // 포커스 또는 값이 있을 때
          (isFocused || hasValue) &&
            '-top-3 text-sm bg-background px-2 py-1 rounded-md left-3',

          // 상태별 색상
          error && 'text-red-500',
          success && 'text-custom-green',
          !error && !success && (isFocused || hasValue) && 'text-custom-green',
          !error &&
            !success &&
            !isFocused &&
            !hasValue &&
            'text-custom-gray-400'
        )}
      >
        {label}
        {required && <span className="text-custom-green px-1">*</span>}
      </label>

      {helperText && (
        <p
          className={cn(
            'text-xs mt-2 pl-4',
            error ? 'text-red-500' : 'text-custom-gray-400'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

interface FloatingTextareaProps extends React.ComponentProps<'textarea'> {
  label: string;
  error?: boolean;
  success?: boolean;
  required?: boolean;
  helperText?: string;
}

export function FloatingTextarea({
  label,
  error = false,
  success = false,
  required = false,
  helperText,
  className,
  id,
  ...props
}: FloatingTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  return (
    <div className="relative w-full">
      <textarea
        id={id}
        className={cn(
          // 기본 스타일
          'peer w-full min-h-[120px] px-4 pt-6 pb-2 text-base font-medium',
          'border border-custom-gray-300 rounded-lg bg-white',
          'transition-all duration-200 ease-in-out',
          'placeholder:text-transparent resize-none',
          'focus:outline-none focus:ring-2 focus:ring-custom-green/20 focus:border-custom-green',
          'disabled:cursor-not-allowed disabled:opacity-50',

          // 상태별 스타일
          error &&
            'border-red-500 bg-red-50 text-red-600 focus:ring-red-500/20 focus:border-red-500',
          success &&
            'border-custom-green bg-custom-green/5 text-custom-green focus:ring-custom-green/20 focus:border-custom-green',

          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />

      <label
        htmlFor={id}
        className={cn(
          'absolute left-4 transition-all duration-200 ease-in-out pointer-events-none',
          'text-base font-medium',

          // 기본 상태
          !isFocused && !hasValue && 'top-4 text-custom-gray-400',

          // 포커스 또는 값이 있을 때
          (isFocused || hasValue) &&
            'top-2 text-sm bg-white px-2 py-1 rounded-md left-3',

          // 상태별 색상
          error && 'text-red-500',
          success && 'text-custom-green',
          !error && !success && (isFocused || hasValue) && 'text-custom-green',
          !error &&
            !success &&
            !isFocused &&
            !hasValue &&
            'text-custom-gray-400'
        )}
      >
        {label}
        {required && <span className="text-red-500 px-1">*</span>}
      </label>

      {helperText && (
        <p
          className={cn(
            'text-xs mt-2 pl-4',
            error ? 'text-red-500' : 'text-custom-gray-400'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
