'use client';
import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
export default function Pagenation({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  // 현재 페이지 기준으로 5개의 페이지 번호만 표시
  const getVisiblePageNumbers = () => {
    const delta = 2; // 현재 페이지 앞뒤로 표시할 페이지 수
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    // 5개가 되도록 조정
    if (end - start + 1 < 5) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }
    }

    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <div
      className={`flex items-center justify-center gap-4 py-6 ${
        totalPages >= 1 ? 'block' : 'hidden'
      }`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 "
        onClick={() => {
          if (currentPage > 1) {
            handlePageChange(currentPage - 1);
          }
        }}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <div className="flex gap-2">
        {visiblePageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            <button
              className={`w-8 h-8 rounded-full text-sm ${
                page === currentPage
                  ? 'bg-green-500 text-white'
                  : 'text-gray-400  '
              }`}
              onClick={() => handlePageChange(page as number)}
            >
              {page}
            </button>
          </React.Fragment>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 "
        onClick={() => {
          if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
          }
        }}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
