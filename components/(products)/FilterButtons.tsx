'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterButtonsProps {
  selectedSort: string;
  pageType?: 'funding' | 'piece';
}

export default function FilterButtons({
  selectedSort,
  pageType = 'funding',
}: FilterButtonsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters =
    pageType === 'piece'
      ? ['최신순', '인기순', '가격순']
      : ['최신순', '남은조각', '가격순'];

  const handleFilterClick = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // sortBy 파라미터로 변환
    let sortBy = 'ID'; // 기본값
    if (pageType === 'piece') {
      if (filter === '최신순') {
        sortBy = 'ID';
      } else if (filter === '인기순') {
        sortBy = 'POPULARITY';
      } else if (filter === '가격순') {
        sortBy = 'PRICE';
      }
    } else {
      if (filter === '최신순') {
        sortBy = 'ID';
      } else if (filter === '남은조각') {
        sortBy = 'REMAINING_PIECE';
      } else if (filter === '가격순') {
        sortBy = 'PRICE';
      }
    }

    params.set('sortBy', sortBy);
    params.set('page', '0'); // 필터 변경 시 페이지를 0으로 리셋
    router.replace(`/${pageType}?${params.toString()}`);
  };

  return (
    <div className="px-4 my-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                selectedSort === filter
                  ? 'bg-gray-700 text-green-400'
                  : 'text-gray-400'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
