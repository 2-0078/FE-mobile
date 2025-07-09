'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { fundingWish, getFundingWish } from '@/action/funding-service';
import { useAlert } from '@/hooks/useAlert';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

interface WishButtonProps {
  fundingUuid: string;
  isWished?: boolean;
  className?: string;
  productUuid: string;
}

export default function WishButton({
  fundingUuid,
  isWished = false,
  className = '',
  productUuid,
}: WishButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [wished, setWished] = useState(isWished);
  const { success, error: showError } = useAlert();
  const router = useRouter();

  // isWished prop이 변경되면 상태 업데이트
  useEffect(() => {
    setWished(isWished);
  }, [isWished]);

  // 컴포넌트 마운트 시 현재 좋아요 상태 확인
  useEffect(() => {
    const checkWishStatus = async () => {
      try {
        setIsInitialLoading(true);
        const wishStatus = await getFundingWish(fundingUuid);
        setWished(Boolean(wishStatus));
      } catch (error) {
        // 로그인이 아니라면 false로 설정
        console.log('User not logged in or error checking wish status:', error);
        setWished(false);
      } finally {
        setIsInitialLoading(false);
      }
    };

    checkWishStatus();
  }, [fundingUuid]);

  const handleWish = async () => {
    startTransition(async () => {
      try {
        setIsLoading(true);
        console.log('fundingUuid', fundingUuid);
        console.log('productUuid', productUuid);

        // 유저가 로그인상태라면 fundingWish 호출
        // fundingWish에 revalidateTag가 추가되어 있음
        // 정상적으로 좋아요 처리되면 revalidateTag 호출됨
        const result = await fundingWish(fundingUuid, productUuid);

        // 에러 객체가 반환된 경우 처리
        if (result && typeof result === 'object' && 'error' in result) {
          if (result.error === '로그인이 필요합니다') {
            // 로그인 필요 에러 메시지 표시 후 로그인 페이지로 이동
            showError('로그인이 필요합니다.');
            setTimeout(() => {
              router.push('/login');
            }, 2000); // 2초 후 로그인 페이지로 이동
          } else {
            showError(result.error as string);
          }
          return;
        }

        setWished(!wished);
        success(
          wished ? '좋아요가 취소되었습니다.' : '좋아요가 추가되었습니다.'
        );
      } catch (error) {
        console.error('Failed to toggle wish:', error);
        showError('좋아요 처리 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    });
  };

  // 초기 로딩 중이거나 좋아요 처리 중일 때 스피너 표시
  if (isInitialLoading || isLoading || isPending) {
    return (
      <button
        disabled={true}
        className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 bg-white/20 text-white ${className}`}
      >
        <LoadingSpinner size="md" variant="spinner" />
      </button>
    );
  }

  return (
    <button
      onClick={handleWish}
      disabled={isLoading || isPending}
      className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 border-2 border-custom-green ${
        wished
          ? 'bg-red-500 text-white'
          : 'bg-white/0 text-white hover:bg-white/30'
      } ${className}`}
    >
      <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} size={12} />
    </button>
  );
}
