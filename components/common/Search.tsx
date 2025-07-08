'use client';
import SearchIcon from '@/repo/ui/Icons/SearchIcon';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

const Search = ({
  placeholder = '상품을 검색하세요.',
  onSearch,
  className = '',
}: SearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState('');

  // URL 파라미터에서 검색어를 읽어와 초기값 설정
  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    setSearchValue(currentSearch);
  }, [searchParams]);

  // 디바운싱된 검색 함수
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          // 검색어가 없으면 아무것도 하지 않음
          if (!value.trim()) {
            return;
          }

          const params = new URLSearchParams(searchParams.toString());
          params.set('search', value.trim());
          params.set('page', '0');

          // 현재 경로에 따라 다른 라우팅
          const currentPath =
            typeof window !== 'undefined' ? window.location.pathname : '';
          if (currentPath.startsWith('/funding')) {
            router.replace(`/funding?${params.toString()}`);
          } else if (currentPath.startsWith('/piece')) {
            router.replace(`/piece?${params.toString()}`);
          } else if (currentPath === '/') {
            // 메인 페이지에서 검색어가 있을 때만 piece로 이동
            router.replace(`/piece?${params.toString()}`);
          }

          onSearch?.(value.trim());
        }, 2000); // 1초 디바운싱
      };
    })(),
    [searchParams, router, onSearch]
  );

  // 검색어 변경 시 자동 검색
  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // 검색어가 없으면 아무것도 하지 않음
      if (!searchValue.trim()) {
        return;
      }

      const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : '';
      const params = new URLSearchParams(searchParams.toString());

      params.set('search', searchValue.trim());
      params.set('page', '0');

      if (currentPath.startsWith('/funding')) {
        router.replace(`/funding?${params.toString()}`);
      } else if (currentPath.startsWith('/piece')) {
        router.replace(`/piece?${params.toString()}`);
      } else if (currentPath === '/') {
        router.replace(`/piece?${params.toString()}`);
      }

      onSearch?.(searchValue.trim());
    }
  };

  const handleClear = () => {
    setSearchValue('');

    const currentPath =
      typeof window !== 'undefined' ? window.location.pathname : '';
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.set('page', '0');

    if (currentPath.startsWith('/funding')) {
      router.replace(`/funding?${params.toString()}`);
    } else if (currentPath.startsWith('/piece')) {
      // piece 페이지에서도 이전 페이지로 돌아가기
      router.back();
    } else if (currentPath === '/') {
      // 메인 페이지에서는 이전 페이지로 돌아가기
      router.back();
    }
  };

  return (
    <div
      className={`flex items-center bg-custom-slate rounded-3xl py-1 w-full ${className}`}
    >
      <div className="w-9 h-9 rounded-full bg-custom-green flex items-center justify-center mr-2">
        <SearchIcon />
      </div>
      <input
        className="bg-transparent flex-1 text-white placeholder-custom-gray-200 text-sm outline-none"
        placeholder={placeholder}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {searchValue && (
        <button
          type="button"
          onClick={handleClear}
          className="mr-2 text-custom-gray-200 hover:text-white text-sm"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Search;
