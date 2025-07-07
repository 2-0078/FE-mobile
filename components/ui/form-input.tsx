'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// ✅ 공통 Props (제네릭으로 element 타입 분리)
interface BaseProps<T extends HTMLElement> {
  id: string;
  name: string;
  title: string;
  defaultValue?: string;
  value?: string;
  required?: boolean;
  readonly?: boolean;
  onChange?: (e: React.ChangeEvent<T>) => void;
  className?: string;
  errorMessage?: string;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
}

// ✅ Input 전용 Props
interface InputProps extends BaseProps<HTMLInputElement> {
  type: string;
}

// ✅ Label + ErrorMessage Wrapper
const BaseInputWrapper = ({
  id,
  title,
  required,
  value,
  errorMessage,
  children,
}: {
  id: string;
  title?: string;
  required?: boolean;
  value: string;
  errorMessage?: string;
  children: React.ReactNode;
}) => (
  <div className="relative w-full">
    {children}
    <label
      htmlFor={id}
      className={cn(
        'absolute left-4 top-4 text-base font-medium ease-in-out duration-200 transition-all',
        errorMessage ? 'text-red-500' : 'text-custom-green',
        value && 'top-2 text-sm bg-white px-2 py-1 rounded-md left-3',
        'peer-focus:top-2 peer-focus:text-sm peer-focus:bg-white peer-focus:px-2 peer-focus:py-1 peer-focus:rounded-md peer-focus:left-3'
      )}
    >
      {title}
      {required && <span className="text-red-500 px-1">*</span>}
    </label>
    {errorMessage && (
      <p className="text-xs mt-2 text-red-500 pl-4">{errorMessage}</p>
    )}
  </div>
);

// ✅ <input> 전용 컴포넌트
export function FormInput({
  id,
  name,
  title,
  type,
  required = false,
  readonly = false,
  defaultValue = '',
  disabled = false,
  placeholder = '',
  onChange,
  errorMessage = '',
  maxLength = 100,
  className,
}: InputProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  return (
    <BaseInputWrapper
      id={id}
      title={title}
      required={required}
      value={value}
      errorMessage={errorMessage}
    >
      <input
        type={type}
        id={id}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        readOnly={readonly}
        onChange={handleChange}
        required={required}
        maxLength={maxLength}
        value={value}
        className={cn(
          'peer w-full border border-custom-gray-300 outline-none text-base pt-6 pb-2 px-4 font-medium rounded-lg transition-all duration-200',
          'bg-white text-custom-black placeholder:text-custom-gray-200',
          'focus:ring-2 focus:ring-custom-green/20 focus:border-custom-green focus:bg-white',
          value && !errorMessage && 'bg-custom-green/5 border-custom-green/30',
          errorMessage && 'bg-red-50 border-red-500 text-red-600',
          disabled && 'cursor-not-allowed bg-custom-gray-100 opacity-50',
          className
        )}
      />
    </BaseInputWrapper>
  );
}

// ✅ <textarea> 전용 컴포넌트
export function TextAreaInput({
  id,
  name,
  title,
  required = false,
  readonly = false,
  disabled = false,
  placeholder = '',
  defaultValue = '',
  onChange,
  errorMessage = '',
  maxLength = 1000,
  className,
}: BaseProps<HTMLTextAreaElement>) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  return (
    <BaseInputWrapper
      id={id}
      title={title}
      required={required}
      value={value}
      errorMessage={errorMessage}
    >
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        readOnly={readonly}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        value={value}
        rows={4}
        className={cn(
          'peer w-full border border-custom-gray-300 outline-none text-base pt-6 pb-2 px-4 font-medium rounded-lg transition-all duration-200 resize-none',
          'bg-white text-custom-black placeholder:text-custom-gray-200',
          'focus:ring-2 focus:ring-custom-green/20 focus:border-custom-green focus:bg-white',
          value && !errorMessage && 'bg-custom-green/5 border-custom-green/30',
          errorMessage && 'bg-red-50 border-red-500 text-red-600',
          disabled && 'cursor-not-allowed bg-custom-gray-100 opacity-50',
          className
        )}
      />
    </BaseInputWrapper>
  );
}

// ✅ <select> 전용 컴포넌트
export function SelectInput({
  id,
  name,
  title,
  required = false,
  disabled = false,
  defaultValue = '',
  onChange,
  errorMessage = '',
  options = [],
  className,
}: BaseProps<HTMLSelectElement> & {
  options: { value: string; label: string }[];
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div className="relative w-full">
      <select
        id={id}
        name={name}
        disabled={disabled}
        onChange={handleChange}
        required={required}
        value={value}
        className={cn(
          'peer w-full h-14 px-4 pt-6 pb-2 text-base font-medium text-white',
          'border border-custom-gray-300 rounded-lg bg-background',
          'transition-all duration-200 ease-in-out',
          'appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-custom-green/20 focus:border-custom-green',
          'disabled:cursor-not-allowed disabled:opacity-50',
          errorMessage &&
            'border-red-500 bg-background text-white focus:ring-red-500/20 focus:border-red-500',
          !errorMessage &&
            value &&
            'border-custom-green text-custom-green focus:ring-custom-green/20 focus:border-custom-green',
          className
        )}
      >
        <option value="" disabled hidden></option>
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="text-base text-black bg-white hover:bg-custom-green/10"
          >
            {opt.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={id}
        className={cn(
          'absolute left-4 transition-all duration-200 ease-in-out pointer-events-none',
          'text-base font-medium',
          !value && 'top-4 text-custom-gray-400',
          value && '-top-3 text-sm bg-background px-2 py-1 rounded-md left-3',
          'peer-focus:-top-3 peer-focus:text-sm peer-focus:bg-background peer-focus:px-2 peer-focus:py-1 peer-focus:rounded-md peer-focus:left-3',
          errorMessage && 'text-red-500',
          !errorMessage && value && 'text-custom-green',
          !errorMessage && !value && 'text-custom-gray-400'
        )}
      >
        {title}
        {required && <span className="text-red-500 px-1">*</span>}
      </label>

      {/* 커스텀 드롭다운 화살표 */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
        <svg
          className="w-4 h-4 text-custom-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {errorMessage && (
        <p className="text-xs mt-2 text-red-500 pl-4">{errorMessage}</p>
      )}
    </div>
  );
}

// ✅ export
export const InputType = {
  FormInput,
  TextAreaInput,
  SelectInput,
};
