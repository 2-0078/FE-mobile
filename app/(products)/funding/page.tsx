import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import BottomNavbar from "@/components/layout/BottomNavbar";
import CategorySection from "@/components/(products)/CategorySection";
import { getMainCategories, getSubCategories } from "@/action/product-service";
import { Category } from "@/types/ProductTypes";
import Pagenation from "@/components/common/Pagenation";
import { FundingListSection } from "@/components/(products)/FundingListSection";

export default async function FundingPage({
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
      id: 1,
      name: "샤넬 클래식 플랩백",
      brand: "Chanel",
      price: "1,630만",
      originalPrice: "1,500만",
      change: "+8.7%",
      isPositive: true,
      image: "chanel-bag",
      mainCategory: "가방",
      subCategory: "샤넬",
    },
    {
      id: 2,
      name: "롤렉스 서브마리너",
      brand: "Rolex",
      price: "1,680만",
      originalPrice: "1,720만",
      change: "-2.3%",
      isPositive: false,
      image: "rolex-watch",
      mainCategory: "시계",
      subCategory: "롤렉스",
    },
    {
      id: 3,
      name: "에르메스 버킨백",
      brand: "Hermès",
      price: "2,100만",
      originalPrice: "1,950만",
      change: "+7.7%",
      isPositive: true,
      image: "hermes-bag",
      mainCategory: "가방",
      subCategory: "에르메스",
    },
    {
      id: 4,
      name: "샤넬 22백팩",
      brand: "Chanel",
      price: "934만",
      originalPrice: "925만",
      change: "+1.0%",
      isPositive: true,
      image: "chanel-backpack",
      mainCategory: "가방",
      subCategory: "샤넬",
    },
    {
      id: 5,
      name: "롤렉스 데이토나",
      brand: "Rolex",
      price: "3,060만",
      originalPrice: "3,200만",
      change: "-4.4%",
      isPositive: false,
      image: "rolex-daytona",
      mainCategory: "시계",
      subCategory: "롤렉스",
    },
    {
      id: 6,
      name: "루이비통 네버풀",
      brand: "Louis Vuitton",
      price: "180만",
      originalPrice: "175만",
      change: "+2.9%",
      isPositive: true,
      image: "lv-bag",
      mainCategory: "가방",
      subCategory: "루이비통",
    },
  ];

  const mainCategories = [
    { id: "전체", categoryName: "전체" },
    ...(await getMainCategories()),
  ];
  let subCategories: Category[] = [];
  if (selectedMainCategory != "전체") {
    subCategories = [
      { id: "전체", categoryName: "전체" },
      ...(await getSubCategories(selectedMainCategory)),
    ];
  }
  return (
    <div className=" pb-20">
      {/* Header */}
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
              className="pl-10 bg-gray-800 border-gray-700 rounded-lg text-white placeholder-gray-400"
            />
          </div>
          <Button className="bg-green-500 hover:bg-green-600 px-4">검색</Button>
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
                    : "text-gray-400 hover:text-white"
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

      {/* Product List */}
      {/* 
        {products.map((product) => (
          <Link href={`/funding/${product.id}`} key={product.id}>
            <div className="flex items-center py-4 border-b border-gray-800 last:border-b-0">
              <div className="w-16 h-16 rounded-lg mr-4 flex items-center justify-center">
                <Image
                  src="/example.png"
                  alt="example"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">
                      {product.brand}
                    </div>
                    <div className="text-sm font-medium text-white">
                      {product.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                      ₩{product.price}
                    </span>
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      product.isPositive ? "text-green-400" : "text-red-400"
                      }`}
                      >
                    {product.change}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        */}

      <FundingListSection />
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">
            해당 카테고리에 상품이 없습니다
          </div>
          <div className="text-sm text-gray-600">
            다른 카테고리를 선택해보세요
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagenation totalPages={10} />
      <BottomNavbar />
    </div>
  );
}
