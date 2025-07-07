'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MultiSelectBoxProps<T> {
  items: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  onSelect?: (selected: T[], name?: string) => void;
  defaultSelected?: T[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  selectWidth?: string;
  dropdownWidth?: string;
  emptyMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MultiSelectBox<T extends Record<string, any>>({
  items,
  valueKey,
  labelKey,
  onSelect,
  defaultSelected = [],
  className = '',
  placeholder = '선택하세요',
  disabled = false,
  name,
  selectWidth = '12rem',
  dropdownWidth,
  emptyMessage = '선택 가능한 항목이 없습니다',
}: MultiSelectBoxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<T[]>(defaultSelected);
  const ref = useRef<HTMLDivElement>(null);

  const toggleSelect = (item: T) => {
    const exists = selectedItems.find((i) => i[valueKey] === item[valueKey]);
    const newSelection = exists
      ? selectedItems.filter((i) => i[valueKey] !== item[valueKey])
      : [...selectedItems, item];
    setSelectedItems(newSelection);
    onSelect?.(newSelection, name);
  };

  const handleRemoveItem = (value: T[keyof T]) => {
    const newSelection = selectedItems.filter(
      (item) => item[valueKey] !== value
    );
    setSelectedItems(newSelection);
    onSelect?.(newSelection, name);
  };

  useEffect(() => {
    const isSame =
      defaultSelected?.length === selectedItems.length &&
      defaultSelected.every(
        (item, idx) => item[valueKey] === selectedItems[idx][valueKey]
      );

    if (!isSame) {
      setSelectedItems(defaultSelected ?? []);
    }
  }, [defaultSelected]);

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

  const baseWidth = {
    width: selectWidth,
    minWidth: selectWidth,
  };

  return (
    <div className="">
      <div
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`bg-white border-[0.05rem] max-w-[14rem] h-fit min-h-[2.4rem] rounded-md px-4 py-2 flex flex-wrap items-center gap-1 cursor-pointer relative shadow-sm
        ${disabled ? 'opacity-50 bg-[#f5f5f5] text-[#a0a0a0] pointer-events-none' : ''} 
        ${className}`}
        style={baseWidth}
      >
        <p className="text-sm text-gray-400">{placeholder}</p>
        <div className={`ml-auto transition-all ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown />
        </div>

        <div
          className={`absolute bg-white rounded-md border z-11 top-[calc(100%+4px)] left-0 shadow-xl overflow-y-auto transition-all max-h-[20rem]
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          style={{
            minWidth: dropdownWidth ?? selectWidth,
          }}
        >
          {items.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400 cursor-default">
              {emptyMessage}
            </p>
          ) : (
            items.map((item) => {
              const isSelected = selectedItems.some(
                (i) => i[valueKey] === item[valueKey]
              );
              return (
                <p
                  key={String(item[valueKey])}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item);
                  }}
                  className={`px-4 py-2 hover:bg-slate-100 cursor-pointer whitespace-nowrap text-sm ${
                    isSelected ? 'bg-slate-100 font-semibold text-brand' : ''
                  }`}
                >
                  {item[labelKey]}
                </p>
              );
            })
          )}
        </div>
      </div>

      {/* 하단 선택된 항목 UI */}
      <div className="flex flex-wrap gap-2 mt-2 overflow-x-auto whitespace-nowrap">
        {selectedItems.map((item) => (
          <span
            key={String(item[valueKey])}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-brand-light"
          >
            {item[labelKey]}
            <button
              onClick={() => handleRemoveItem(item[valueKey])}
              className="ml-1 text-[10px] text-gray-600 hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
