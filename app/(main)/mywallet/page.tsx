'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Gem,
  Trophy,
  Heart,
  Gavel,
  Wallet,
  ShoppingBag,
  TrendingUp,
  Plus,
  Minus,
  ArrowRight,
  Calendar,
  PieChart,
  BarChart3,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { getMemberBalance } from '@/action/payment-service';
import { ResponsiveAmount } from '@/components/atoms/ResponsiveAmount';
import { AmountSkeleton } from '@/components/atoms';
import { useRouter } from 'next/navigation';

// 예치금 및 자산 섹션 컴포넌트
function DepositAndAssetsSection({
  balance,
  loading,
}: {
  balance: number;
  loading: boolean;
}) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* 예치금 카드 */}
      <div className="bg-gradient-to-r from-custom-green/20 to-custom-blue/20 rounded-2xl p-6 border border-custom-green/30">
        <div className="flex flex-col items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-custom-green/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-custom-green" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">현재 예치금</p>
              {loading ? (
                <AmountSkeleton className="h-16 w-50" />
              ) : (
                <ResponsiveAmount
                  amount={balance}
                  className="text-2xl font-bold text-white"
                />
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/charge')}
              className="bg-custom-green text-black hover:bg-custom-green/90 px-3 py-1 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              충전
            </Button>
            <Button
              onClick={() => router.push('/withdraw')}
              variant="outline"
              className="border-custom-green text-custom-green hover:bg-custom-green/10 px-3 py-1 text-sm"
            >
              <Minus className="w-4 h-4 mr-1" />
              출금
            </Button>
          </div>
        </div>
      </div>

      {/* 자산 요약 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Gem className="w-5 h-5 text-custom-green" />
            <span className="text-gray-400 text-sm">총 자산</span>
          </div>
          <p className="text-white font-bold text-lg">₩15,670,000</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-sm">+12.5%</span>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-5 h-5 text-custom-blue" />
            <span className="text-gray-400 text-sm">수익률</span>
          </div>
          <p className="text-white font-bold text-lg">+8.3%</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-sm">+2.1%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 수익률 섹션 컴포넌트
function ProfitRateSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">수익률 현황</h3>
        <Button
          variant="ghost"
          className="text-custom-green hover:text-custom-green/80"
        >
          상세보기
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-white font-medium">이번 달 수익</p>
                <p className="text-gray-400 text-sm">2024년 1월</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-500 font-bold text-lg">+₩2,450,000</p>
              <p className="text-green-500 text-sm">+15.2%</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-white font-medium">전체 수익</p>
                <p className="text-gray-400 text-sm">누적</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-500 font-bold text-lg">+₩8,320,000</p>
              <p className="text-blue-500 text-sm">+8.3%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 공모 이력 섹션 컴포넌트
function FundingHistorySection() {
  const fundingHistory = [
    {
      id: 1,
      title: '마리안나 나폴리타니 작품',
      amount: 500000,
      date: '2024-01-15',
      status: '진행중',
      profit: 125000,
      profitRate: 25,
    },
    {
      id: 2,
      title: '반 고흐 자화상',
      amount: 300000,
      date: '2024-01-10',
      status: '완료',
      profit: 45000,
      profitRate: 15,
    },
    {
      id: 3,
      title: '피카소 블루 시리즈',
      amount: 800000,
      date: '2024-01-05',
      status: '완료',
      profit: 160000,
      profitRate: 20,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">공모 이력</h3>
        <Button
          variant="ghost"
          className="text-custom-green hover:text-custom-green/80"
        >
          전체보기
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {fundingHistory.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-custom-green/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-custom-green" />
                </div>
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-gray-400 text-sm">{item.date}</p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === '진행중'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-green-500/20 text-green-500'
                }`}
              >
                {item.status}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-xs">투자금액</p>
                <p className="text-white font-semibold">
                  ₩{item.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">수익</p>
                <p className="text-green-500 font-semibold">
                  +₩{item.profit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">수익률</p>
                <p className="text-green-500 font-semibold">
                  +{item.profitRate}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 예치금 이력 섹션 컴포넌트
function DepositHistorySection() {
  const depositHistory = [
    {
      id: 1,
      type: '충전',
      amount: 1000000,
      date: '2024-01-15 14:30',
      status: '완료',
      method: '카드',
    },
    {
      id: 2,
      type: '출금',
      amount: 500000,
      date: '2024-01-10 09:15',
      status: '완료',
      method: '계좌이체',
    },
    {
      id: 3,
      type: '충전',
      amount: 2000000,
      date: '2024-01-05 16:45',
      status: '완료',
      method: '카드',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">예치금 이력</h3>
        <Button
          variant="ghost"
          className="text-custom-green hover:text-custom-green/80"
        >
          전체보기
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {depositHistory.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === '충전' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                >
                  {item.type === '충전' ? (
                    <Plus className="w-5 h-5 text-green-500" />
                  ) : (
                    <Minus className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{item.type}</p>
                  <p className="text-gray-400 text-sm">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold text-lg ${
                    item.type === '충전' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {item.type === '충전' ? '+' : '-'}₩
                  {item.amount.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs">{item.method}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">상태</span>
              <span className="text-green-500 text-sm font-medium">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 메뉴 버튼 섹션 컴포넌트
function MenuButtonsSection() {
  const router = useRouter();

  const menuItems = [
    {
      icon: Gem,
      label: '보유 조각',
      color: 'text-green-400',
      href: '/my-pieces',
    },
    {
      icon: Trophy,
      label: '참여 공모',
      color: 'text-yellow-400',
      href: '/my-fundings',
    },
    { icon: Heart, label: '찜 목록', color: 'text-red-400', href: '/wishlist' },
    {
      icon: Gavel,
      label: '내 경매',
      color: 'text-pink-400',
      href: '/my-auctions',
    },
    {
      icon: ShoppingBag,
      label: '구매 상품',
      color: 'text-purple-400',
      href: '/my-purchases',
    },
    {
      icon: Calendar,
      label: '거래 내역',
      color: 'text-blue-400',
      href: '/transaction-history',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">빠른 메뉴</h3>
      <div className="grid grid-cols-2 gap-3">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => router.push(item.href)}
            className="bg-gray-900 p-4 h-auto flex flex-col items-center space-y-2 border border-gray-700 hover:bg-gray-800"
          >
            <item.icon className={`h-6 w-6 ${item.color}`} />
            <span className="text-white text-sm">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function MyWalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceData = await getMemberBalance();
        setBalance(balanceData?.amount || 0);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="pb-24 px-4 space-y-6 pt-20">
      <Header
        className="px-4 py-2 mt-4"
        title="내 자산"
        isAlert={false}
        isCloseButton={false}
      />

      {/* 예치금 및 자산 섹션 */}
      <DepositAndAssetsSection balance={balance} loading={loading} />

      {/* 수익률 섹션 */}
      <ProfitRateSection />

      {/* 공모 이력 섹션 */}
      <FundingHistorySection />

      {/* 예치금 이력 섹션 */}
      <DepositHistorySection />

      {/* 메뉴 버튼 섹션 */}
      <MenuButtonsSection />
    </div>
  );
}
