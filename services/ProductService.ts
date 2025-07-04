import {
  getFundingProductsList,
  getFundingProduct,
  getPieceProductsList,
  getPieceProducts,
} from '@/action/product-service';
import { FundingProductType, PieceProductType } from '@/types/ProductTypes';

export class ProductService {
  /**
   * 공모 상품 목록과 상세 정보를 가져옵니다.
   */
  static async getFundingProducts(
    params: { page?: number; size?: number } = {}
  ) {
    try {
      // 1. 공모 상품 UUID 목록 가져오기
      const fundingProductsList = await getFundingProductsList({
        page: params.page || 1,
        size: params.size || 10,
      });

      // 2. 각 상품의 상세 정보 가져오기
      const fundingProducts = await Promise.all(
        fundingProductsList.fundingUuidList.map(async (fundingUuid: string) => {
          try {
            return await getFundingProduct(fundingUuid);
          } catch (error) {
            console.error(
              `Failed to fetch funding product ${fundingUuid}:`,
              error
            );
            return null;
          }
        })
      );

      // 3. null 값 필터링
      const validFundingProducts = fundingProducts.filter(
        (product) => product !== null
      ) as FundingProductType[];

      return {
        products: validFundingProducts,
        totalElements: fundingProductsList.totalElements,
        totalPage: fundingProductsList.totalPage,
      };
    } catch (error) {
      console.error('Failed to fetch funding products:', error);
      return {
        products: [],
        totalElements: 0,
        totalPage: 0,
      };
    }
  }

  /**
   * 조각 상품 목록과 상세 정보를 가져옵니다.
   */
  static async getPieceProducts(params: { page?: number; size?: number } = {}) {
    try {
      // 1. 조각 상품 UUID 목록 가져오기
      const pieceProductsList = await getPieceProductsList();

      // 2. 각 상품의 상세 정보 가져오기
      const pieceProducts = await Promise.all(
        pieceProductsList.pieceProductUuidList.map(
          async (pieceUuid: string) => {
            try {
              return await getPieceProducts(pieceUuid);
            } catch (error) {
              console.error(
                `Failed to fetch piece product ${pieceUuid}:`,
                error
              );
              return null;
            }
          }
        )
      );

      // 3. null 값 필터링
      const validPieceProducts = pieceProducts.filter(
        (product) => product !== null
      ) as PieceProductType[];

      return {
        products: validPieceProducts,
        totalElements: pieceProductsList.totalElements,
        totalPage: pieceProductsList.totalPage,
      };
    } catch (error) {
      console.error('Failed to fetch piece products:', error);
      return {
        products: [],
        totalElements: 0,
        totalPage: 0,
      };
    }
  }

  /**
   * 메인 페이지용 상품 데이터를 가져옵니다.
   */
  static async getMainPageProducts() {
    try {
      const [fundingResult, pieceResult] = await Promise.all([
        this.getFundingProducts({ page: 1, size: 10 }),
        this.getPieceProducts({ page: 1, size: 10 }),
      ]);

      return {
        fundingProducts: fundingResult.products,
        pieceProducts: pieceResult.products,
      };
    } catch (error) {
      console.error('Failed to fetch main page products:', error);
      return {
        fundingProducts: [],
        pieceProducts: [],
      };
    }
  }
}
