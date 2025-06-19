"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Category } from "@/types/ProductTypes";

export default function CategorySection({
  mainCategories,
  subCategories,
}: {
  mainCategories: Category[];
  subCategories: Category[];
}) {
  const searchParams = useSearchParams();
  const selectedMainCategory = searchParams.get("main") || "전체";
  const selectedSubCategory = searchParams.get("sub") || "전체";
  const router = useRouter();

  // URL 파라미터 업데이트 함수
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "" || value === "전체") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // 메인 카테고리 변경 시 서브 카테고리와 페이지 초기화
    if (key === "main") {
      params.delete("sub");
      params.delete("page");
    }

    // 서브 카테고리 변경 시 페이지 초기화
    if (key === "sub") {
      params.delete("page");
    }

    router.replace(`?${params.toString()}`);
  };
  const handleMainCategoryChange = (category: string) => {
    updateSearchParams("main", category);
  };

  const handleSubCategoryChange = (subCategory: string) => {
    // 같은 서브카테고리 클릭 시 토글
    if (selectedSubCategory === subCategory) {
      updateSearchParams("sub", "");
    } else {
      updateSearchParams("sub", subCategory);
    }
  };

  return (
    <>
      <div className="px-4 py-4">
        <div
          className="flex gap-2 overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {mainCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleMainCategoryChange(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedMainCategory == category.id
                  ? "bg-custom-green text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>
      {selectedMainCategory !== "전체" && subCategories.length > 0 && (
        <div className="px-4 pb-4">
          <div
            className="flex gap-2 overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none",
            }}
          >
            {subCategories.map((subCategory) => (
              <button
                key={subCategory.id}
                onClick={() => handleSubCategoryChange(subCategory.id)}
                className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${
                  selectedSubCategory == subCategory.id
                    ? "bg-custom-green text-gray-900 font-medium"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {subCategory.categoryName}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
