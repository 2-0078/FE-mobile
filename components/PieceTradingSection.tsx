'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import {
  placeBuyOrder,
  placeSellOrder,
  getUserPieceHoldings,
} from '@/action/trading-service';
import { getMemberBalance } from '@/action/payment-service';
import { useAlert } from '@/hooks/useAlert';
import { useRouter } from 'next/navigation';

interface PieceTradingSectionProps {
  pieceUuid: string;
  currentPrice: number;
  tradeQuantity?: number;
  onTradingCompleted?: () => void;
  isPreviousPrice?: boolean; // 전일 가격인지 여부
}

export function PieceTradingSection({
  pieceUuid,
  currentPrice,
  tradeQuantity,
  onTradingCompleted,
  isPreviousPrice = false,
}: PieceTradingSectionProps) {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(currentPrice.toString());
  const [isPending, startTransition] = useTransition();
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [userHoldings, setUserHoldings] = useState<{
    quantity: number;
    averagePrice: number;
  } | null>(null);
  const [holdingsLoading, setHoldingsLoading] = useState(true);
  const { success, error: showError } = useAlert();
  const router = useRouter();

  // 사용자 보유 현황 조회
  useEffect(() => {
    const fetchUserHoldings = async () => {
      try {
        setHoldingsLoading(true);
        const holdings = await getUserPieceHoldings(pieceUuid);
        setUserHoldings(holdings);
      } catch (error) {
        console.error('Failed to fetch user holdings:', error);
        setUserHoldings(null);
      } finally {
        setHoldingsLoading(false);
      }
    };

    fetchUserHoldings();
  }, [pieceUuid]);

  // 잔액 불러오기
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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 빈 값이면 그대로 설정
    if (value === '') {
      setQuantity('');
      return;
    }

    // 숫자만 입력 가능
    if (!/^\d+$/.test(value)) {
      return;
    }

    const numValue = Number(value);

    // 매도인 경우 보유 수량까지만 입력 가능
    if (
      userHoldings &&
      userHoldings.quantity > 0 &&
      numValue > userHoldings.quantity
    ) {
      setQuantity(userHoldings.quantity.toString());
      return;
    }

    setQuantity(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 빈 값이면 그대로 설정
    if (value === '') {
      setPrice('');
      return;
    }

    // 숫자만 입력 가능
    if (!/^\d+$/.test(value)) {
      return;
    }

    setPrice(value);
  };

  const handleBuy = async () => {
    if (!quantity || Number(quantity) === 0) {
      showError('수량을 입력해주세요.');
      return;
    }

    if (!price || Number(price) === 0) {
      showError('가격을 입력해주세요.');
      return;
    }

    const totalAmount = Number(quantity) * Number(price);
    if (totalAmount > balance) {
      showError('예치금이 부족합니다. 예치금을 충전해주세요.');
      return;
    }

    startTransition(async () => {
      try {
        await placeBuyOrder(pieceUuid, Number(quantity), Number(price));
        success('매수 주문이 성공적으로 처리되었습니다!');
        setQuantity('');
        setPrice(currentPrice.toString());

        // 잔액 새로고침
        const newBalanceData = await getMemberBalance();
        setBalance(newBalanceData?.amount || 0);

        // 보유 현황 새로고침
        const newHoldings = await getUserPieceHoldings(pieceUuid);
        setUserHoldings(newHoldings);

        // 부모 컴포넌트에 거래 완료 알림
        if (onTradingCompleted) {
          onTradingCompleted();
        }

        // 페이지 새로고침
        router.refresh();
      } catch (err) {
        console.error('Buy order failed:', err);
        if (err instanceof Error) {
          showError(err.message);
        } else {
          showError('매수 주문 중 오류가 발생했습니다.');
        }
      }
    });
  };

  const handleSell = async () => {
    if (!quantity || Number(quantity) === 0) {
      showError('수량을 입력해주세요.');
      return;
    }

    if (!price || Number(price) === 0) {
      showError('가격을 입력해주세요.');
      return;
    }

    if (!userHoldings || Number(quantity) > userHoldings.quantity) {
      showError('보유 수량보다 많은 수량을 매도할 수 없습니다.');
      return;
    }

    startTransition(async () => {
      try {
        await placeSellOrder(pieceUuid, Number(quantity), Number(price));
        success('매도 주문이 성공적으로 처리되었습니다!');
        setQuantity('');
        setPrice(currentPrice.toString());

        // 보유 현황 새로고침
        const newHoldings = await getUserPieceHoldings(pieceUuid);
        setUserHoldings(newHoldings);

        // 부모 컴포넌트에 거래 완료 알림
        if (onTradingCompleted) {
          onTradingCompleted();
        }

        // 페이지 새로고침
        router.refresh();
      } catch (err) {
        console.error('Sell order failed:', err);
        if (err instanceof Error) {
          showError(err.message);
        } else {
          showError('매도 주문 중 오류가 발생했습니다.');
        }
      }
    });
  };

  const isBuyDisabled =
    !quantity ||
    Number(quantity) === 0 ||
    !price ||
    Number(price) === 0 ||
    isPending ||
    isPreviousPrice; // 장 마감 시 거래 불가
  const isSellDisabled =
    !quantity ||
    Number(quantity) === 0 ||
    !price ||
    Number(price) === 0 ||
    isPending ||
    !userHoldings ||
    userHoldings.quantity === 0 ||
    isPreviousPrice; // 장 마감 시 거래 불가

  // 예치금이 부족한지 확인 (매수 시에만)
  const isInsufficientBalance = Number(quantity) * Number(price) > balance;

  return (
    <>
      {/* 가격 및 거래량 정보 */}
      <div className="flex justify-around gap-x-3 mb-4">
        <div className="text-center">
          <p className="text-gray-600 text-xs">
            {isPreviousPrice ? '전일 종가' : '현재가'}
          </p>
          <p className="text-black text-lg font-bold">
            {currentPrice.toLocaleString()}원
          </p>
          {isPreviousPrice && (
            <p className="text-gray-500 text-xs mt-1">(장 마감)</p>
          )}
        </div>
        {tradeQuantity && (
          <div className="text-center">
            <p className="text-gray-600 text-xs">거래량</p>
            <p className="text-black text-lg font-bold">
              {tradeQuantity.toLocaleString()}개
            </p>
          </div>
        )}
      </div>

      {/* 잔액 표시 */}
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
        {isInsufficientBalance && quantity && Number(quantity) > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/charge')}
          >
            예치금이 부족하신가요?
          </Button>
        )}
      </div>

      {/* 보유 현황 표시 */}
      {!holdingsLoading && userHoldings && userHoldings.quantity > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-blue-800 font-semibold mb-2">보유 현황</h3>
          <div className="flex justify-between text-sm">
            <span className="text-blue-600">
              보유 수량: {userHoldings.quantity}개
            </span>
            <span className="text-blue-600">
              평균 매수가: {userHoldings.averagePrice.toLocaleString()}원
            </span>
          </div>
        </div>
      )}

      {/* 총 금액 표시 */}
      <div className="text-center">
        <p className="text-gray-600 text-xs">거래 총액</p>
        <p
          className={`text-3xl font-semibold mb-4 ${isInsufficientBalance && quantity && Number(quantity) > 0 ? 'text-red-500' : 'text-black'}`}
        >
          {(Number(quantity) * Number(price)).toLocaleString()}원
        </p>
        {isInsufficientBalance && quantity && Number(quantity) > 0 && (
          <p className="text-red-500 text-sm mb-2">예치금이 부족합니다</p>
        )}
      </div>

      {/* 수량 입력 */}
      <div className="px-6 mb-4">
        <div className="mb-4">
          <div className="text-gray-600 text-xs mb-1">
            {userHoldings && userHoldings.quantity > 0
              ? '매도 수량'
              : '매수 수량'}
          </div>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder={
              userHoldings && userHoldings.quantity > 0
                ? '매도할 수량을 입력하세요'
                : '매수할 수량을 입력하세요'
            }
            className="w-full text-center text-black text-2xl font-bold border-b border-gray-300 pb-2 h-10 bg-transparent focus:outline-none focus:border-custom-green"
            min="0"
            max={userHoldings ? userHoldings.quantity : undefined}
          />
          <div className="text-right text-gray-400 text-sm mt-1">
            {userHoldings && userHoldings.quantity > 0
              ? `최대 ${userHoldings.quantity}개`
              : '수량을 입력하세요'}
          </div>
        </div>
      </div>

      {/* 가격 입력 */}
      <div className="px-6 mb-6">
        <div className="mb-4">
          <div className="text-gray-600 text-xs mb-1">가격 (원)</div>
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            placeholder="가격을 입력하세요"
            className="w-full text-center text-black text-2xl font-bold border-b border-gray-300 pb-2 h-10 bg-transparent focus:outline-none focus:border-custom-green"
            min="1"
          />
          <div className="text-right text-gray-400 text-sm mt-1">
            {isPreviousPrice ? '전일 종가' : '현재가'}:{' '}
            {currentPrice.toLocaleString()}원
          </div>
        </div>
      </div>

      {/* 장 마감 알림 */}
      {isPreviousPrice && (
        <div className="px-6 mb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm text-center">
              장이 마감되어 거래가 불가능합니다.
              <br />
              다음 거래일을 기다려주세요.
            </p>
          </div>
        </div>
      )}

      {/* 매수/매도 버튼 */}
      <div className="px-6 mt-4">
        <div className="flex gap-3">
          {userHoldings && userHoldings.quantity > 0 && (
            <Button
              onClick={handleSell}
              disabled={isSellDisabled}
              className="flex-1 h-14 bg-red-600 text-white text-lg font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
            >
              {isPending
                ? '처리중...'
                : isPreviousPrice
                  ? '장 마감'
                  : '매도하기'}
            </Button>
          )}
          <Button
            onClick={handleBuy}
            disabled={isBuyDisabled}
            className={`h-14 bg-custom-green text-black text-lg font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 ${userHoldings && userHoldings.quantity > 0 ? 'flex-1' : 'w-full'}`}
          >
            {isPending ? '처리중...' : isPreviousPrice ? '장 마감' : '매수하기'}
          </Button>
        </div>
      </div>
    </>
  );
}
