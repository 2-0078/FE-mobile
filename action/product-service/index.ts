"use server";
import { CommonResponseType } from "@/types/CommonTypes";
import {
  CategoryType,
  FundingListResponseType,
  FundingProductType,
} from "@/types/ProductTypes";

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

export const getFundingProductsList = async () => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/product-read-service/api/v1/funding/list`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data =
    (await response.json()) as CommonResponseType<FundingProductType>;
  return data.result;
};
