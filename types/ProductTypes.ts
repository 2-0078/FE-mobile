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
  previousClosingPrice?: number | null; // 전일 마지막 가격
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

// 호가 데이터 타입
export interface OrderBookItem {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBookData {
  bids: OrderBookItem[]; // 매수호가
  asks: OrderBookItem[]; // 매도호가
  lastPrice: number;
  change: number;
  changePercent: number;
  spread: number;
  volume: number;
}

export interface OrderBookResponse {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: OrderBookData;
}

// 기간별 시세 데이터 타입 (실제 API 응답 구조에 맞춤)
export interface PeriodMarketPriceItem {
  stckBsopDate: string; // 주식 영업일자
  stckOprc: number; // 주식 시가
  stckClpr: number; // 주식 종가
  stckHgpr: number; // 주식 고가
  stckLwpr: number; // 주식 저가
  acmlVol: number; // 누적 거래량
  acmlTrPbmn: number; // 누적 거래대금
}

export interface PeriodMarketPriceData {
  periodMarketPriceList: PeriodMarketPriceItem[];
}

export interface PeriodMarketPriceResponse {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: PeriodMarketPriceData;
}

// 실시간 시세 데이터 타입
export interface RealTimePriceData {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
  bid: number;
  ask: number;
  high: number;
  low: number;
  open: number;
}

export interface RealTimePriceResponse {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: RealTimePriceData;
}

// 실시간 호가 데이터 타입 (SSE 스트리밍)
export interface RealTimeQuotesData {
  stockcode: string; // 매핑된 주식 코드
  askp: number[]; // 매도 호가 가격 리스트 (체결가 기준 위로 10단계 가격)
  bidp: number[]; // 매수 호가 가격 리스트 (체결가 기준 아래로 10단계 가격)
  askpRsqn: number[]; // 각 매도 호가 가격에 대응하는 매도 잔량 리스트
  bidRsqn: number[]; // 각 매수 호가 가격에 대응하는 매수 잔량 리스트
}

export interface RealTimeQuotesResponse {
  data: RealTimeQuotesData;
  timestamp: string;
}
