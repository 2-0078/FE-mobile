'use client';

<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useModal } from "@/stores/modal-store";
=======
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import { useModal } from '@/stores/modal-store';
import { fundingWish } from '@/action/funding-service';
>>>>>>> feat/productsPage

export function BottomActions() {
  const { openModal } = useModal();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-transparent backdrop-blur-[2px]"></div>

      <div className="relative px-6 py-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="w-14 h-14 rounded-full bg-white"
        >
<<<<<<< HEAD
          <Heart className="w-6 h-6 text-custom-red fill-custom-red" />
=======
          <Heart
            className={`w-6 h-6 ${
              isWish ? 'text-custom-red fill-custom-red' : 'text-custom-black'
            }`}
          />
>>>>>>> feat/productsPage
        </Button>
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
          참여하기
        </Button>
      </div>
    </div>
  );
}
