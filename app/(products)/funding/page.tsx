import BottomNavbar from '@/components/layout/BottomNavbar';
import CategorySection from '@/components/(products)/CategorySection';
import {
  getFundingProductsList,
  getMainCategories,
  getSubCategories,
  getFundingProduct,
} from '@/action/product-service';
import { CategoryType } from '@/types/ProductTypes';
import Pagenation from '@/components/common/Pagenation';
import { FundingListSection } from '@/components/(products)/FundingListSection';
import SearchBar from '@/components/common/SearchBar';

export default async function FundingPage({
  searchParams,
}: {
  searchParams: Promise<{
    sort: string;
    main: string;
    sub: string;
    search: string;
    page: number;
  }>;
}) {
  // URL에서 카테고리 정보 가져오기
  const params = await searchParams;
  const selectedSort = params.sort || '최신순';
  const selectedMainCategory = params.main || '전체';
  const selectedSubCategory = params.sub || '전체';
  const selectedSearch = params.search || '';
  const selectedPage = params.page || 1;
  const filters = ['최신순', '인기순', '가격순'];

  console.log('Funding page params:', {
    selectedSort,
    selectedMainCategory,
    selectedSubCategory,
    selectedSearch,
    selectedPage,
  });

  const mainCategories = [
    { id: '전체', categoryName: '전체' },
    ...(await getMainCategories()),
  ];

  let subCategories: CategoryType[] = [];
  if (selectedMainCategory != '전체') {
    subCategories = [
      { id: '전체', categoryName: '전체' },
      ...(await getSubCategories(selectedMainCategory)),
    ];
  }

  console.log('Categories loaded:', {
    mainCategories: mainCategories.length,
    subCategories: subCategories.length,
  });

  const fundingProductsUuidList = await getFundingProductsList({
    main: selectedMainCategory,
    sub: selectedSubCategory,
    search: selectedSearch,
    page: selectedPage,
  });

  console.log('Funding products UUID list:', fundingProductsUuidList);

  // null 체크 추가
  const fundingProducts = fundingProductsUuidList?.fundingUuidList
    ? await Promise.all(
        fundingProductsUuidList.fundingUuidList.map(async (Uuid) => {
          const product = await getFundingProduct(Uuid);
          console.log('Individual product loaded:', product?.productName);
          return product;
        })
      )
    : [];

  console.log('Final funding products:', {
    count: fundingProducts.length,
    products: fundingProducts.map((p) => p?.productName),
  });

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

      <SearchBar />
      {/* Filters */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedSort === filter
                    ? 'bg-gray-700 text-green-400'
                    : 'text-gray-400'
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
          총{' '}
          <span className="text-green-400 font-medium">
            {fundingProductsUuidList?.totalElements || 0}
          </span>
          개의 상품
        </p>
      </div>

      <FundingListSection fundingProducts={fundingProducts} />

      {(fundingProductsUuidList?.totalElements === 0 ||
        fundingProducts.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">검색된 상품이 없습니다</div>
          <div className="text-sm text-gray-600">
            다른 카테고리 & 검색어를 입력해보세요
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagenation totalPages={fundingProductsUuidList?.totalPage || 1} />
      <BottomNavbar />
    </div>
  );
}
