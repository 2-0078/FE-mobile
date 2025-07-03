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
  main: string;
  sub: string;
  search?: string;
  page?: number;
}) => {
  const { main, sub, search, page } = params;
  const queryParams = new URLSearchParams();
  if (main !== '전체') queryParams.set('main', main);
  if (sub !== '전체') queryParams.set('sub', sub);
  if (search) queryParams.set('name', search);
  if (page) queryParams.set('page', (page - 1).toString());
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
  return data.result;
};

export const getPieceProductsList = async (params: {
  main: string;
  sub: string;
  search?: string;
  page?: number;
}) => {
  const { main, sub, search, page } = params;
  const queryParams = new URLSearchParams();
  if (main !== '전체') queryParams.set('main', main);
  if (sub !== '전체') queryParams.set('sub', sub);
  if (search) queryParams.set('name', search);
  if (page) queryParams.set('page', (page - 1).toString());
  const response = await fetch(
    `${
      process.env.BASE_API_URL
    }/product-read-service/api/v1/piece/list?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data =
    (await response.json()) as CommonResponseType<PieceProductListResponseType>;
  console.log(data);
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
  return data.result;
};
