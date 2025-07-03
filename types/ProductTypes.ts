import { BasePaginationResponseType } from "./CommonTypes";

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
  status: string;
}

export interface FundingProductType extends BaseProductType {
  funding: FundingInfoType;
}

export interface PieceProductType extends BaseProductType {
  piece: PieceInfoType;
}
