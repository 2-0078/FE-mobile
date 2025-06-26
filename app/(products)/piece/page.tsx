import React from "react";
import BottomNavbar from "@/components/layout/BottomNavbar";
import Link from "next/link";
import Image from "next/image";
import {
  getMainCategories,
  getPieceProductsList,
} from "@/action/product-service";
import { getSubCategories } from "@/action/product-service";
import { CategoryType } from "@/types/ProductTypes";
import CategorySection from "@/components/(products)/CategorySection";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagenation from "@/components/common/Pagenation";
import { formatPrice } from "@/lib/utils";
export default async function PiecePage({
  searchParams,
}: {
  searchParams: Promise<{
    sort: string;
    main: string;
  }>;
}) {
  // URL에서 카테고리 정보 가져오기
  const params = await searchParams;
  const selectedSort = params.sort || "최신순";
  const selectedMainCategory = params.main || "전체";

  const filters = ["최신순", "인기순", "가격순"];

  const products = [
    {
      id: "1",
      image: "/placeholder.svg?height=60&width=60",
      title: "샤넬 클래식 플랩백",
      brand: "Chanel",
      currentPrice: 1630000,
      dailyChange: 142000,
      dailyChangePercent: 8.7,
      priceHistory: [1400000, 1450000, 1480000, 1520000, 1580000, 1630000],
    },
    {
      id: "2",
      image: "/placeholder.svg?height=60&width=60",
      title: "롤렉스 서브마리너",
      brand: "Rolex",
      currentPrice: 1680000,
      dailyChange: -39000,
      dailyChangePercent: -2.3,
      priceHistory: [1750000, 1720000, 1700000, 1690000, 1680000, 1680000],
    },
    {
      id: "3",
      image: "/placeholder.svg?height=60&width=60",
      title: "에르메스 버킨백",
      brand: "Hermès",
      currentPrice: 2100000,
      dailyChange: 158000,
      dailyChangePercent: 7.7,
      priceHistory: [1900000, 1950000, 2000000, 2050000, 2080000, 2100000],
    },
    {
      id: "4",
      image: "/placeholder.svg?height=60&width=60",
      title: "샤넬 22백팩",
      brand: "Chanel",
      currentPrice: 934000,
      dailyChange: 9000,
      dailyChangePercent: 1.0,
      priceHistory: [920000, 925000, 930000, 928000, 932000, 934000],
    },
    {
      id: "5",
      image: "/placeholder.svg?height=60&width=60",
      title: "롤렉스 데이토나",
      brand: "Rolex",
      currentPrice: 3060000,
      dailyChange: -140000,
      dailyChangePercent: -4.4,
      priceHistory: [3300000, 3250000, 3200000, 3150000, 3100000, 3060000],
    },
  ];

  const mainCategories = [
    { id: "전체", categoryName: "전체" },
    ...(await getMainCategories()),
  ];
  let subCategories: CategoryType[] = [];
  if (selectedMainCategory != "전체") {
    subCategories = [
      { id: "전체", categoryName: "전체" },
      ...(await getSubCategories(selectedMainCategory)),
    ];
  }

  const pieceProducts = await getPieceProductsList();
  console.log(pieceProducts);
  const MiniChart = ({
    data,
    isPositive,
  }: {
    data: number[];
    isPositive: boolean;
  }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 60;
        const y = 20 - ((value - min) / range) * 20;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width="60" height="20" className="flex-shrink-0">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="1.5"
          className="drop-shadow-sm"
        />
      </svg>
    );
  };

  return (
    <div className=" pb-20">
      <div className="px-4 py-4 text-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-custom-green">Piece of Cake</h1>
      </div>

      <CategorySection
        mainCategories={mainCategories}
        subCategories={subCategories}
      />

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="상품을 검색하세요"
              className="pl-10 bg-slate-800/50 border-gray-700 rounded-lg text-white placeholder-gray-400"
            />
          </div>
          <Button className="bg-green-500 px-4">검색</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedSort === filter
                    ? "bg-gray-700 text-green-400"
                    : "text-gray-400"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Count */}
      <div className="px-4 mb-4">
        <p className="text-sm text-gray-400">
          총{" "}
          <span className="text-green-400 font-medium">{products.length}</span>
          개의 상품
        </p>
      </div>

      <div className="space-y-4 px-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-slate-800/50 h-30 rounded-lg px-4 py-2 border border-slate-700/50"
          >
            <Link href={`/piece/${product.id}`}>
              <div className="flex items-center gap-3">
                <div className="w-16 h-24 relative rounded-lg flex items-center justify-center">
                  <Image
                    src="/example.png"
                    alt="example"
                    fill={true}
                    className="object-contain mx-auto"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-medium text-white truncate">
                        {product.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <MiniChart
                        data={product.priceHistory}
                        isPositive={product.dailyChangePercent > 0}
                      />
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-lg font-bold text-white">
                        {formatPrice(product.currentPrice)}
                      </p>
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          product.dailyChangePercent > 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {product.dailyChangePercent > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {product.dailyChangePercent > 0 ? "+" : ""}
                          {product.dailyChangePercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Pagenation totalPages={10} />

      <BottomNavbar />
    </div>
  );
}
