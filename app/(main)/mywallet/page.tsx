import React from 'react';
import { Button } from '@/components/ui/button';
import { Gem, Trophy, Heart, Gavel, Wallet, ShoppingBag } from 'lucide-react';
import Header from '@/components/layout/Header';
import AmmountCard from '@/components/AmmountCard';
import AssetPieChart from '@/components/(main)/AssetPieChart';

export default function MyWalletPage() {
  return (
    <div className="pb-24 px-4 space-y-4">
      <Header className="px-4 py-2 mt-4" title="내 자산" />

      <AmmountCard />

      {/* Asset Pie Chart */}
      <AssetPieChart />

      {/* Menu Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="ghost"
          className="bg-slate-800/50  p-4 h-auto flex flex-col items-center space-y-2"
        >
          <Gem className="h-6 w-6 text-green-400" />
          <span className="text-white text-sm">보유 조각</span>
        </Button>
        <Button
          variant="ghost"
          className="bg-slate-800/50  p-4 h-auto flex flex-col items-center space-y-2"
        >
          <Trophy className="h-6 w-6 text-yellow-400" />
          <span className="text-white text-sm">참여 공모</span>
        </Button>
        <Button
          variant="ghost"
          className="bg-slate-800/50  p-4 h-auto flex flex-col items-center space-y-2"
        >
          <Heart className="h-6 w-6 text-red-400" />
          <span className="text-white text-sm">찜 목록</span>
        </Button>
        <Button
          variant="ghost"
          className="bg-slate-800/50  p-4 h-auto flex flex-col items-center space-y-2"
        >
          <Gavel className="h-6 w-6 text-pink-400" />
          <span className="text-white text-sm">내 경매</span>
        </Button>
        <Button
          variant="ghost"
          className="bg-slate-800/50  p-4 h-auto flex flex-col items-center space-y-2"
        >
          <Wallet className="h-6 w-6 text-gray-400" />
          <span className="text-white text-sm">예치금 사용 내역</span>
        </Button>
        <Button
          variant="ghost"
          className="bg-slate-800/50  p-4 h-auto flex flex-col items-center space-y-2"
        >
          <ShoppingBag className="h-6 w-6 text-purple-400" />
          <span className="text-white text-sm">내 구매 상품</span>
        </Button>
      </div>
    </div>
  );
}
