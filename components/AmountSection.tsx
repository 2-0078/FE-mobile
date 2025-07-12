'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { fundingParticipate } from '@/action/funding-service';
import { getMemberBalance } from '@/action/payment-service';
import { useAlert } from '@/hooks/useAlert';
import { useRouter } from 'next/navigation';

interface AmountSectionProps {
  piecePrice: number;
  remainingPieces: number;
  fundingUuid?: string;
  productUuid?: string;
  onFundingParticipated?: () => void; // Funding 참여 완료 시 호출될 콜백
}

export function AmountSection({
  piecePrice,
  remainingPieces,
  fundingUuid,
  onFundingParticipated,
}: AmountSectionProps) {
  const [amount, setAmount] = useState('');
  const [isPending, startTransition] = useTransition();
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const { success, error: showError } = useAlert();
  const router = useRouter();

  // 참여 가능한 조각이 없는 경우
  const hasNoRemainingPieces = remainingPieces <= 0;

  // 실제 잔액 불러오기
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceData = await getMemberBalance();
        setBalance(balanceData?.amount || 0);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance(0);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 빈 값이면 그대로 설정
    if (value === '') {
      setAmount('');
      return;
    }

    // 숫자만 입력 가능 (0으로 시작하는 경우도 허용)
    if (!/^\d+$/.test(value)) {
      return;
    }

    const numValue = Number(value);

    // 최대 수량까지만 입력 가능
    if (numValue > remainingPieces) {
      setAmount(remainingPieces.toString());
      return;
    }

    setAmount(value);
  };

  const handleParticipate = async () => {
    if (!amount || Number(amount) === 0) {
      showError('수량을 입력해주세요.');
      return;
    }

    if (!fundingUuid) {
      showError('펀딩 정보를 찾을 수 없습니다.');
      return;
    }

    // 잔액 부족 체크
    const totalAmount = Number(amount) * piecePrice;
    if (totalAmount > balance) {
      showError('예치금이 부족합니다. 예치금을 충전해주세요.');
      return;
    }

    startTransition(async () => {
      try {
        await fundingParticipate(fundingUuid, Number(amount));
        success('펀딩 참여가 완료되었습니다!');
        setAmount('');

        // 잔액 새로고침
        const newBalanceData = await getMemberBalance();
        setBalance(newBalanceData?.amount || 0);

        // 부모 컴포넌트에 Funding 참여 완료 알림
        if (onFundingParticipated) {
          onFundingParticipated();
        }

        // 페이지 새로고침 또는 데이터 갱신
        router.refresh();
      } catch (err) {
        console.error('Funding participation failed:', err);
        if (err instanceof Error) {
          showError(err.message);
        } else {
          showError('펀딩 참여 중 오류가 발생했습니다.');
        }
      }
    });
  };

  const isParticipateDisabled =
    !amount || Number(amount) === 0 || isPending || hasNoRemainingPieces;

  // 예치금이 부족한지 확인 (입력된 수량의 총액이 잔액보다 큰 경우)
  const isInsufficientBalance = Number(amount) * piecePrice > balance;

  return (
    <>
      <div>
        <p className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm flex items-center">
            <Wallet className="w-4 h-4 mr-1 text-custom-green" />
            예치금 잔액
          </span>
          <span className="text-custom-green text-2xl font-bold">
            {balanceLoading ? '로딩 중...' : `${balance.toLocaleString()}원`}
          </span>
        </p>
        {/* 예치금이 부족할 때만 버튼 표시 */}
        {isInsufficientBalance && amount && Number(amount) > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/charge')}
          >
            예치금이 부족하신가요?
          </Button>
        )}
      </div>

      <div className="text-center">
        <p className="text-gray-600 text-xs">매수 총액</p>
        <p
          className={`text-3xl font-semibold mb-4 ${isInsufficientBalance && amount && Number(amount) > 0 ? 'text-red-500' : 'text-black'}`}
        >
          {(Number(amount) * piecePrice).toLocaleString()}원
        </p>
        {isInsufficientBalance && amount && Number(amount) > 0 && (
          <p className="text-red-500 text-sm mb-2">예치금이 부족합니다</p>
        )}
      </div>

      <div className="px-6 mb-6">
        <div className="mb-4">
          <div className="text-gray-600 text-xs mb-1">구매 수량</div>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="수량을 입력하세요"
            className="w-full text-center text-black text-2xl font-bold border-b border-gray-300 pb-2 h-10 bg-transparent focus:outline-none focus:border-custom-green"
            min="0"
            max={remainingPieces}
            disabled={hasNoRemainingPieces}
          />
          <div className="text-right text-gray-400 text-sm mt-1">
            최대 {remainingPieces}개
          </div>
        </div>
      </div>

      {/* Funding 참여 버튼 */}
      {fundingUuid && (
        <div className="px-6 mt-4">
          <Button
            onClick={handleParticipate}
            disabled={isParticipateDisabled}
            className="w-full h-14 bg-custom-green text-black text-lg font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? '처리중...'
              : hasNoRemainingPieces
                ? '공모가능한 조각이 없습니다'
                : '펀딩에 참여하기'}
          </Button>
        </div>
      )}
    </>
  );
}
