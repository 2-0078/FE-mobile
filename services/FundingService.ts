import {
  getFundingProductsList,
  getFundingProduct,
  getMainCategories,
  getSubCategories,
} from '@/action/product-service';
import { CategoryType, FundingProductType } from '@/types/ProductTypes';

export interface FundingListParams {
  sortBy?: string;
  main?: string;
  sub?: string;
  search?: string;
  page?: number;
  size?: number;
  direction?: string;
}

export interface FundingListResult {
  products: FundingProductType[];
  totalElements: number;
  totalPage: number;
  currentPage: number;
}

export class FundingService {
  /**
   * 펀딩 상품 목록을 가져옵니다.
   */
  static async getFundingProducts(
    params: FundingListParams
  ): Promise<FundingListResult> {
    try {
      // 1. 펀딩 상품 UUID 목록 가져오기
      const fundingProductsUuidList = await getFundingProductsList(params);

      if (!fundingProductsUuidList?.fundingUuidList) {
        return {
          products: [],
          totalElements: 0,
          totalPage: 1,
          currentPage: params.page || 0,
        };
      }

      // 2. 각 상품의 상세 정보 가져오기
      const productsWithNull = await Promise.all(
        fundingProductsUuidList.fundingUuidList.map(async (uuid, index) => {
          try {
            console.log(
              `Loading funding product ${index + 1}/${fundingProductsUuidList.fundingUuidList.length}:`,
              uuid
            );
            const product = await getFundingProduct(uuid);
            console.log(
              'Individual funding product loaded:',
              product?.productName,
              product?.funding?.fundingUuid
            );
            return product;
          } catch (error) {
            console.error(
              'Error loading funding product with UUID:',
              uuid,
              error
            );
            return null;
          }
        })
      );

      // 3. null 값 필터링
      const products = productsWithNull.filter(
        (product): product is FundingProductType => product !== null
      );

      return {
        products,
        totalElements: fundingProductsUuidList.totalElements || 0,
        totalPage: fundingProductsUuidList.totalPage || 1,
        currentPage: fundingProductsUuidList.page || 0,
      };
    } catch (error) {
      console.error('Error fetching funding products:', error);
      return {
        products: [],
        totalElements: 0,
        totalPage: 1,
        currentPage: params.page || 0,
      };
    }
  }

  /**
   * 메인 카테고리 목록을 가져옵니다.
   */
  static async getMainCategories(): Promise<CategoryType[]> {
    try {
      const categories = await getMainCategories();
      return [{ id: '전체', categoryName: '전체' }, ...categories];
    } catch (error) {
      console.error('Error fetching main categories:', error);
      return [{ id: '전체', categoryName: '전체' }];
    }
  }

  /**
   * 서브 카테고리 목록을 가져옵니다.
   */
  static async getSubCategories(
    mainCategoryId: string
  ): Promise<CategoryType[]> {
    try {
      if (mainCategoryId === '전체') {
        return [];
      }
      const categories = await getSubCategories(mainCategoryId);
      return [{ id: '전체', categoryName: '전체' }, ...categories];
    } catch (error) {
      console.error('Error fetching sub categories:', error);
      return [{ id: '전체', categoryName: '전체' }];
    }
  }

  /**
   * 정렬 파라미터를 한국어로 변환합니다.
   */
  static convertSortByToKorean(sortBy?: string): string {
    switch (sortBy) {
      case 'REMAINING_PIECE':
        return '남은조각';
      case 'PRICE':
        return '가격순';
      case 'ID':
      default:
        return '최신순';
    }
  }
}
