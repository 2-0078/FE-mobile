'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useModal } from '@/stores/modal-store';
import WishButton from '@/components/common/WishButton';
import { getUserPieceHoldings } from '@/action/trading-service';

interface PieceBottomActionsProps {
  pieceUuid: string;
  productUuid: string;
}

export function PieceBottomActions({
  pieceUuid,
  productUuid,
}: PieceBottomActionsProps) {
  const { openModal } = useModal();
  const [userHoldings, setUserHoldings] = useState<{
    quantity: number;
    averagePrice: number;
  } | null>(null);

  // 사용자 보유 현황 조회
  const fetchUserHoldings = async () => {
    try {
      const holdings = await getUserPieceHoldings(pieceUuid);
      setUserHoldings(holdings);
    } catch (error) {
      console.error('Failed to fetch user holdings:', error);
      setUserHoldings(null);
    }
  };

  useEffect(() => {
    fetchUserHoldings();
  }, [pieceUuid]);

  const buttonText =
    userHoldings && userHoldings.quantity > 0 ? '매도하기' : '매수하기';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-transparent backdrop-blur-[2px]"></div>

      <div className="relative px-6 py-6 flex items-center gap-4">
        <WishButton fundingUuid={pieceUuid} productUuid={productUuid} />
        <Button
          variant="ghost"
          size="icon"
          className="w-14 h-14 rounded-full border-2 border-custom-green bg-transparent"
          onClick={() => openModal('comments')}
        >
          <MessageCircle className="w-6 h-6 text-custom-green" />
        </Button>
        <Button
          className="flex-1 h-14 rounded-full bg-custom-green text-black text-lg font-bold"
          onClick={() => openModal('details')}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
