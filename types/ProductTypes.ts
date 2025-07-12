import { BasePaginationResponseType } from './CommonTypes';

export interface CategoryType {
  id: string;
  categoryName: string;
}
export interface BaseProductType {
  productUuid: string;
  mainCategory: CategoryType;
  subCategory: CategoryType;
  productName: string;
  description: string;
  aiEstimatedPrice: number;
  aiEstimatedDescription: string | null;
  images: ImageType[];
}

export interface FundingListResponseType extends BasePaginationResponseType {
  fundingUuidList: string[];
}

export interface PieceProductListResponseType
  extends BasePaginationResponseType {
  pieceProductUuidList: string[];
}

export interface ImageType {
  imageIndex: number;
  imageUrl: string;
  isThumbnail: boolean;
}

export interface FundingInfoType {
  fundingUuid: string;
  fundingAmount: number;
  piecePrice: number;
  totalPieces: number;
  remainingPieces: number;
  availablePieces: number;
  fundingDeadline: string;
  fundingStatus: string;
}

export interface PieceInfoType {
  pieceProductUuid: string;
  isTrading: boolean | null;
  tradeQuantity: number;
  closingPrice: number | null;
  marketPrice?: number;
  marketData?: MarketPriceData;
  status: string;
}

export interface FundingProductType extends BaseProductType {
  funding: FundingInfoType;
}

export interface PieceProductType extends BaseProductType {
  piece: PieceInfoType;
}

export interface MarketPriceData {
  stckPrpr: number; // 현재가
  stckOprc: number; // 시가
  stckHgpr: number; // 고가
  stckLwpr: number; // 저가
  prdyVrssSign: string; // 전일 대비 부호 (1: 상승, 2: 하락, 3: 보합)
  prdyVrss: number; // 전일 대비
  prdyCrt: number; // 전일 대비 등락률
}

export interface MarketPriceResponse {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: MarketPriceData;
}

export interface QoutesData {
  askp: number[]; // 매도호가
  bidp: number[]; // 매수호가
  askpRsq: number[]; // 매도호가 대비 등락률
  bidpRsq: number[]; // 매수호가 대비 등락률
}

export interface QoutesResponse {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: QoutesData;
}
