'use server';
import { CommonResponseType } from '@/types/CommonTypes';
import {
  CategoryType,
  FundingListResponseType,
  FundingProductType,
  PieceProductListResponseType,
  PieceProductType,
} from '@/types/ProductTypes';

export const getMainCategories = async () => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/product-service/api/v1/main-category/list`
  );
  console.log(response);
  const data = (await response.json()) as CommonResponseType<CategoryType[]>;
  return data.result;
};

export const getSubCategories = async (mainCategoryId: string) => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/product-service/api/v1/sub-category/list/${mainCategoryId}`
  );
  const data = (await response.json()) as CommonResponseType<CategoryType[]>;
  return data.result;
};

export const getFundingProductsList = async (params: {
  sort?: string;
  main?: string;
  sub?: string;
  search?: string;
  page?: number;
  size?: number;
  direction?: string;
}) => {
  const { sort, main, sub, search, page, size, direction } = params;
  const queryParams = new URLSearchParams();

  if (sort) queryParams.append('sort', sort);
  if (main) queryParams.append('main', main);
  if (sub) queryParams.append('sub', sub);
  if (search) queryParams.append('search', search);
  if (page) queryParams.append('page', page.toString());
  if (size) queryParams.append('size', size.toString());
  if (direction) queryParams.append('direction', direction);

  const response = await fetch(
    `${
      process.env.BASE_API_URL
    }/product-read-service/api/v1/funding/list?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data =
    (await response.json()) as CommonResponseType<FundingListResponseType>;
  return data.result;
};

export const getFundingProduct = async (id: string) => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/product-read-service/api/v1/funding/list/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data =
    (await response.json()) as CommonResponseType<FundingProductType>;
  // console.log(data.result);
  return data.result;
};

export const getPieceProductsList = async () => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/product-read-service/api/v1/piece/list`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data =
    (await response.json()) as CommonResponseType<PieceProductListResponseType>;
  // console.log(data);
  return data.result;
};

export const getPieceProducts = async (productUuid: string) => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/product-read-service/api/v1/piece/list/${productUuid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data = (await response.json()) as CommonResponseType<PieceProductType>;
  // console.log(data.result);
  return data.result;
};

export const getPieceMarketPrice = async (pieceProductUuid: string) => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/piece-service/api/v1/piece/product/market-price/${pieceProductUuid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  type MarketPriceApiResponse = { marketPrice?: number; price?: number };
  const data = (await response.json()) as CommonResponseType<
    MarketPriceApiResponse | number
  >;
  console.log('Market price raw response:', data);
  console.log('Market price result:', data.result);

  // 응답 구조에 따라 적절히 처리
  if (typeof data.result === 'number') {
    return { marketPrice: data.result };
  } else if (data.result && typeof data.result.marketPrice === 'number') {
    return { marketPrice: data.result.marketPrice };
  } else if (data.result && typeof data.result.price === 'number') {
    return { marketPrice: data.result.price };
  } else {
    console.error('Unexpected market price response structure:', data.result);
    return { marketPrice: 0 };
  }
};
