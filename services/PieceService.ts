import {
  getPieceProductsList,
  getPieceProducts,
  getMainCategories,
  getSubCategories,
} from '@/action/product-service';
import { CategoryType, PieceProductType } from '@/types/ProductTypes';

export interface PieceListParams {
  sortBy?: string;
  main?: string;
  sub?: string;
  search?: string;
  page?: number;
  size?: number;
  direction?: string;
}

export interface PieceListResult {
  products: PieceProductType[];
  totalElements: number;
  totalPage: number;
  currentPage: number;
}

export class PieceService {
  /**
   * 조각 상품 목록을 가져옵니다.
   */
  static async getPieceProducts(
    params: PieceListParams
  ): Promise<PieceListResult> {
    try {
      // 1. 조각 상품 UUID 목록 가져오기
      const pieceProductUuidList = await getPieceProductsList(params);

      if (!pieceProductUuidList?.pieceProductUuidList) {
        return {
          products: [],
          totalElements: 0,
          totalPage: 1,
          currentPage: params.page || 0,
        };
      }

      // 2. 각 상품의 상세 정보 가져오기
      const productsWithNull = await Promise.all(
        pieceProductUuidList.pieceProductUuidList.map(async (uuid, index) => {
          try {
            const product = await getPieceProducts(uuid);

            return product;
          } catch (error) {
            console.error(
              'Error loading piece product with UUID:',
              uuid,
              error
            );
            return null;
          }
        })
      );

      // 3. null 값 필터링
      const products = productsWithNull.filter(
        (product): product is PieceProductType => product !== null
      );

      return {
        products,
        totalElements: pieceProductUuidList.totalElements || 0,
        totalPage: pieceProductUuidList.totalPage || 1,
        currentPage: pieceProductUuidList.page || 0,
      };
    } catch (error) {
      console.error('Error fetching piece products:', error);
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
      case 'POPULARITY':
        return '인기순';
      case 'PRICE':
        return '가격순';
      case 'ID':
      default:
        return '최신순';
    }
  }
}
