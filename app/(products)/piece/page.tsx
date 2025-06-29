import React from "react";
import BottomNavbar from "@/components/layout/BottomNavbar";
import Link from "next/link";
import Image from "next/image";
import {
  getMainCategories,
  getPieceProducts,
  getPieceProductsList,
} from "@/action/product-service";
import { getSubCategories } from "@/action/product-service";
import { CategoryType } from "@/types/ProductTypes";
import CategorySection from "@/components/(products)/CategorySection";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagenation from "@/components/common/Pagenation";
import { formatPrice } from "@/lib/tool";
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

  const pieceProductUuidList = await getPieceProductsList();
  console.log(pieceProductUuidList);

  const pieceProducts = await Promise.all(
    pieceProductUuidList.pieceProductUuidList.map((uuid) =>
      getPieceProducts(uuid)
    )
  );
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
        const x = (index / (data.length - 1)) * 40;
        const y = 20 - ((value - min) / range) * 20;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width="40" height="20" className="flex-shrink-0">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
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
          <span className="text-green-400 font-medium">
            {pieceProductUuidList.totalElements}
          </span>
          개의 상품
        </p>
      </div>

      <div className="space-y-4 px-4">
        {pieceProducts.map((product) => (
          <div
            key={product.piece.pieceProductUuid}
            className="bg-slate-800/50 h-30 rounded-lg px-4 py-2 border border-slate-700/50"
          >
            <Link href={`/piece/${product.piece.pieceProductUuid}`}>
              <div className="flex items-center gap-3">
                <div className="min-w-16 h-24 relative rounded-lg flex items-center justify-center">
                  <Image
                    src={product.images[0].imageUrl}
                    alt="example"
                    width={60}
                    height={60}
                    className="object-contain mx-auto"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-1/3">
                      <p className="text-xs text-slate-400 mb-1 truncate">
                        {product.mainCategory.categoryName} &gt;{" "}
                        {product.subCategory.categoryName}
                      </p>
                      <h3 className="text-sm font-medium text-white">
                        {product.productName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 수정필요 */}
                      <MiniChart
                        data={[
                          1400000, 1450000, 1480000, 1520000, 1580000, 1630000,
                        ]}
                        isPositive={true}
                      />
                    </div>
                    <div className="text-center flex-shrink-0 ml-2 w-1/4">
                      <p className="text-base font-bold text-white">
                        {/* 수정필요 */}
                        {formatPrice(product.aiEstimatedPrice)}
                      </p>
                      <div
                        className={`flex justify-center items-center gap-1 text-xs ${
                          1 > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {1 > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {1 > 0 ? "+" : ""}
                          {1}%
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

      <Pagenation totalPages={pieceProductUuidList.totalPage} />

      <BottomNavbar />
    </div>
  );
}
