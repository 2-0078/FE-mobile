'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/stores/modal-store';
import { Heart, MessageCircle } from 'lucide-react';

interface PieceBottomActionsProps {
  pieceUuid: string;
  productUuid: string;
}

export default function PieceBottomActions({
  pieceUuid,
  productUuid,
}: PieceBottomActionsProps) {
  const { openModal } = useModal();

  const handleCommentsClick = () => {
    openModal('comments');
  };

  const handleWishClick = () => {
    // TODO: 찜 기능 구현
    console.log('Wish clicked for piece:', pieceUuid);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50">
      <div className="flex gap-3">
        <Button
          onClick={handleCommentsClick}
          className="flex-1 bg-custom-green text-black font-semibold hover:bg-custom-green/90"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          댓글
        </Button>
        <Button
          onClick={handleWishClick}
          variant="outline"
          className="border-custom-green text-custom-green hover:bg-custom-green/10"
        >
          <Heart className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
