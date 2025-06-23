"use client";
import {
  ArrowLeft,
  Bell,
  Home,
  CreditCard,
  BarChart3,
  User,
  Gem,
  Trophy,
  Heart,
  Gavel,
  Wallet,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactECharts from "echarts-for-react";
import Header from "@/components/layout/Header";

function AssetPieChart() {
  const assetData = [
    { name: "예치금", value: 5234000, color: "#1e40af", percentage: 45 },
    { name: "조각", value: 3456000, color: "#0891b2", percentage: 30 },
    { name: "공모", value: 2345000, color: "#06b6d4", percentage: 20 },
    { name: "경매", value: 1234000, color: "#67e8f9", percentage: 5 },
  ];

  const option = {
    backgroundColor: "transparent",

    series: [
      {
        name: "자산 분포",
        type: "pie",
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#1f2937",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        data: assetData.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color,
          },
        })),
      },
    ],
  };

  return (
    <div className="bg-gray-800 rounded-2xl px-4 pt-2">
      <h3 className="text-white text-lg font-semibold text-center">
        내 자산 가치
      </h3>

      <div className="flex items-center h-50 text-center">
        {/* ECharts Pie Chart */}
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "60%" }}
          opts={{ renderer: "svg" }}
        />
        {/* Legend */}
        <div className="flex-1 space-y-3">
          {assetData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300 text-sm">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium">
                  ₩{(item.value / 10000).toFixed(0)}만원
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AssetManagementPage() {
  return (
    <div className="pb-24 px-4 space-y-4">
      <Header className="px-4 py-2 mt-4" title="내 자산" />

      {/* Total Assets Card */}
      <div>
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="text-center mb-6">
            <p className="text-gray-400 mb-2">예치금</p>
            <h2 className="text-3xl font-bold mb-1">₩12,345</h2>
            <p className="text-red-400 text-sm">+1.23%</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button className=" bg-custom-light-blue">충전하기</Button>
            <Button className="bg-custom-light-blue">출금하기</Button>
          </div>
        </div>
      </div>

      {/* Asset Pie Chart */}
      <AssetPieChart />

      {/* Menu Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="ghost"
          className="bg-gray-800 hover:bg-gray-700 p-4 h-auto flex flex-col items-center space-y-2"
        >
          <Gem className="h-6 w-6 text-green-400" />
          <span className="text-white text-sm">보유 조각</span>
        </Button>
        <Button
          variant="ghost"
          className="bg-gray-800 hover:bg-gray-700 p-4 h-auto flex flex-col items-center space-y-2"
        >
          <Trophy className="h-6 w-6 text-yellow-400" />
          <span className="text-white text-sm">참여 공모</span>
        </Button>
        <Button
          variant="ghost"
          className="bg-gray-800 hover:bg-gray-700 p-4 h-auto flex flex-col items-center space-y-2"
        >
          <Heart className="h-6 w-6 text-red-400" />
          <span className="text-white text-sm">찜 목록</span>
        </Button>
        <Button
          variant="ghost"
          className="bg-gray-800 hover:bg-gray-700 p-4 h-auto flex flex-col items-center space-y-2"
        >
          <Gavel className="h-6 w-6 text-pink-400" />
          <span className="text-white text-sm">내 경매</span>
        </Button>
        <Button
          variant="ghost"
          className="bg-gray-800 hover:bg-gray-700 p-4 h-auto flex flex-col items-center space-y-2"
        >
          <Wallet className="h-6 w-6 text-gray-400" />
          <span className="text-white text-sm">예치금 사용 내역</span>
        </Button>
        <Button
          variant="ghost"
          className="bg-gray-800 hover:bg-gray-700 p-4 h-auto flex flex-col items-center space-y-2"
        >
          <ShoppingBag className="h-6 w-6 text-purple-400" />
          <span className="text-white text-sm">내 구매 상품</span>
        </Button>
      </div>
    </div>
  );
}
