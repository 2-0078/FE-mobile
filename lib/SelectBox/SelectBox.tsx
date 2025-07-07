'use client';

import { useEffect, useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const variantStyleMap = {
  primary: '',
  secondary: 'text-secondary',
} as const;

// interface BaseProps<T extends HTMLElement> {
//   id: string;
//   name: string;
//   title: string;
//   defaultValue?: string;
//   value?: string;
//   required?: boolean;
//   readonly?: boolean;
//   onChange?: (e: React.ChangeEvent<T>) => void;
//   className?: string;
//   errorMessage?: string;
//   maxLength?: number;
//   maxHeight?: string; // Tiptap 전용
//   disabled?: boolean;
//   placeholder?: string;
// }

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
        'absolute left-[1.2rem] top-[1.1rem] text-[1.1rem] font-medium ease-in-out duration-150',
        errorMessage ? 'text-red-500' : 'text-custom-green',
        value &&
          'top-[-1.11rem] text-sm bg-background px-2 py-[0.2rem] rounded-md left-[1rem]',
        'peer-focus:top-[-1.11rem] peer-focus:text-sm peer-focus:bg-white peer-focus:px-2 peer-focus:py-[0.2rem] peer-focus:rounded-md peer-focus:left-[1rem]'
      )}
    >
      {title}
      {required && <span className="text-custom-green-200 px-1">*</span>}
    </label>
    {errorMessage && (
      <p className="text-xs mt-2 text-red-500 pl-4">{errorMessage}</p>
    )}
  </div>
);
type SelectBoxStyle = keyof typeof variantStyleMap;

interface SelectBoxProps<T> {
  id: string;
  title?: string;
  required?: boolean;
  errorMessage?: string;
  items: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  onSelect?: (item: T, name?: string) => void;
  defaultValue?: T;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  direction?: 'up' | 'down';
  variant?: SelectBoxStyle;
  name?: string;
  selectWidth?: string; // select 박스 너비
  dropdownWidth?: string; // 드롭다운 너비
  dropdownHeight?: string; // 드롭다운 최대 높이
  emptyMessage?: string;
  selectedValue?: T;
  setSelectedValue?: (value: T | undefined) => void;
  renderLabel?: (item: T) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SelectBox<T extends Record<string, any>>({
  id,
  title,
  required = false,
  errorMessage,
  items,
  valueKey,
  labelKey,
  onSelect,
  defaultValue,
  className = '',
  placeholder = '선택하세요',
  disabled = false,
  direction = 'down',
  variant = 'primary',
  name,
  selectWidth = '12rem',
  dropdownWidth,
  dropdownHeight,
  emptyMessage = '선택 가능한 항목이 없습니다',
  selectedValue,
  setSelectedValue,
  renderLabel,
}: SelectBoxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>(defaultValue);
  const ref = useRef<HTMLDivElement>(null);

  const value = selectedValue ?? selectedItem;

  const handleSelect = (item: T) => {
    setSelectedItem(item);
    setSelectedValue?.(item);
    setIsOpen(false);
    onSelect?.(item, name);
  };

  useEffect(() => {
    if (selectedValue === undefined) {
      setSelectedItem(defaultValue);
    } else {
      setSelectedItem(selectedValue);
    }
  }, [defaultValue, selectedValue]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 드롭다운 방향
  const dropdownStyle =
    direction === 'up'
      ? { bottom: 'calc(100% + 4px)', top: 'auto' }
      : { top: 'calc(100% + 4px)', bottom: 'auto' };

  const baseWidth = {
    width: selectWidth,
    minWidth: selectWidth,
  };

  return (
    <BaseInputWrapper
      id={id}
      title={title}
      required={required}
      value={items.length > 0 ? String(value?.[labelKey]) : ''}
      errorMessage={errorMessage}
    >
      <div
        ref={ref}
        onClick={(e) => {
          if (disabled) return;
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          'relative peer w-full border-[1px] border-custom-green/50 outline-none text-[1.1rem] pt-5 pb-3 px-4 font-semibold rounded-md',
          'bg-background text-white placeholder:text-custom-green/70',
          'focus:ring-2 focus:ring-custom-green/20 focus:border-custom-green focus:bg-custom-green focus:text-custom-green',
          value && !errorMessage && 'bg-custom-green/10 ',
          errorMessage && 'bg-red-50 border-red-500 text-red-400',
          disabled ? 'opacity-30 cursor-not-allowed' : '',
          variantStyleMap[variant],
          className
        )}
        style={baseWidth}
      >
        <p className="line-clamp-1">
          {value
            ? renderLabel
              ? renderLabel(value)
              : String(value[labelKey])
            : placeholder}
        </p>
        <div
          className={`transition-all absolute right-3 bottom-1/2 translate-y-1/2 ${isOpen ? 'rotate-180' : ''}`}
        >
          <ChevronDown size={20} className="text-brand" />
        </div>

        <div
          className={`border-1 border-custom-green absolute bg-background w-fit rounded-md cursor-pointer top-10 left-0 transition-all z-11 overflow-y-auto shadow-xl 
          ${isOpen ? 'h-fit opacity-100' : 'h-0 opacity-0 invisible'}`}
          style={{
            ...dropdownStyle,
            left: 0,
            minWidth: dropdownWidth ?? selectWidth,
            maxHeight: dropdownHeight ?? '20rem',
          }}
        >
          {items.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400 cursor-default">
              {emptyMessage}
            </p>
          ) : (
            items.map((item) => (
              <p
                key={String(item[valueKey])}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(item);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-slate-100 whitespace-nowrap"
                title={String(item[labelKey])}
              >
                {renderLabel ? renderLabel(item) : String(item[labelKey])}
              </p>
            ))
          )}
        </div>
      </div>
    </BaseInputWrapper>
  );
}

export default SelectBox;
