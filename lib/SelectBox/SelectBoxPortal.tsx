'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface SelectBoxPortalProps<T> {
  items: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  onSelect?: (item: T, name?: string) => void;
  defaultValue?: T;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  selectWidth?: string; // select 박스 너비
  dropdownWidth?: string; // 드롭다운 너비
  emptyMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SelectBoxPortal<T extends Record<string, any>>({
  items,
  valueKey,
  labelKey,
  onSelect,
  defaultValue,
  className = '',
  placeholder = '선택하세요',
  disabled = false,
  name,
  selectWidth = '12rem',
  dropdownWidth,
  emptyMessage = '선택 가능한 항목이 없습니다',
}: SelectBoxPortalProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>(defaultValue);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (item: T) => {
    setSelectedItem(item);
    setIsOpen(false);
    onSelect?.(item, name);
  };

  // 외부 defaultValue가 바뀌면 내부 selectedItem도 반영
  useEffect(() => {
    setSelectedItem(defaultValue);
  }, [defaultValue]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // dropdown 위치 계산
  useEffect(() => {
    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current!.getBoundingClientRect();

      // 뷰포트 기준 → 문서(스크롤 포함) 기준으로
      const docTop = rect.top + window.scrollY;
      const docBottom = rect.bottom + window.scrollY;
      const docLeft = rect.left + window.scrollX;

      const dropdownHeight = 320;

      const viewportTop = window.scrollY;
      const viewportBottom = window.scrollY + window.innerHeight;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fitsBelow = docBottom + dropdownHeight <= viewportBottom;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fitsAbove = docTop - dropdownHeight >= viewportTop;

      const style: React.CSSProperties = {
        position: 'absolute',
        left: docLeft,
        width: dropdownWidth ?? selectWidth,
        maxHeight: '20rem',
        zIndex: 9999,
      };

      // FIXME: 위로 여는 위치 안맞음
      // // 아래로 열기
      // if (fitsBelow) {
      //   style.top = docBottom + 4;
      // }
      // // 위로 열기
      // else if (fitsAbove) {
      //   style.top = docTop - dropdownHeight - 4;
      // }
      // // 공간 부족 시 기본 아래
      // else {
      //   style.top = docBottom + 4;
      // }

      style.top = docBottom + 4;
      setDropdownStyle(style);
    }
  }, [isOpen]);

  const baseWidth = {
    width: selectWidth,
    minWidth: selectWidth,
  };

  return (
    <>
      <div
        ref={wrapperRef}
        onClick={(e) => toggleDropdown(e)}
        className={`relative border rounded-md h-[2.4rem] px-4 flex items-center justify-between bg-white text-sm cursor-pointer shadow-sm 
          ${disabled ? 'opacity-50 bg-[#f5f5f5] text-[#a0a0a0] pointer-events-none' : ''} 
          ${className}`}
        style={baseWidth}
      >
        <p className="line-clamp-1">
          {selectedItem ? selectedItem[labelKey] : placeholder}
        </p>
        <div
          className={`transition-all ${isOpen ? (dropdownStyle.bottom ? '' : 'rotate-180') : ''}`}
        >
          <ChevronDown />
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div
            className="absolute bg-white border rounded-md shadow-xl max-h-[20rem] overflow-y-auto transition-all"
            style={dropdownStyle}
            ref={dropdownRef}
          >
            {items.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400 cursor-default">
                {emptyMessage}
              </p>
            ) : (
              items.map((item) => {
                const isDisabled = Boolean(item?.disabled);

                return (
                  <p
                    key={String(item[valueKey])}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (isDisabled) return;
                      handleSelect(item);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-slate-100 whitespace-nowrap
                      ${
                        isDisabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'cursor-pointer hover:bg-slate-100'
                      }`}
                    title={String(item[labelKey])}
                  >
                    {item[labelKey]}
                  </p>
                );
              })
            )}
          </div>,
          document.body
        )}
    </>
  );
}

export default SelectBoxPortal;
