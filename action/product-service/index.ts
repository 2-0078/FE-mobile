"use server";
import { CommonResponseType } from "@/types/CommonTypes";
import { Category } from "@/types/ProductTypes";

export const getMainCategories = async () => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/product-service/api/v1/main-category/list`
  );
  const data = (await response.json()) as CommonResponseType<Category[]>;
  return data.result;
};

export const getSubCategories = async (mainCategoryId: string) => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/product-service/api/v1/sub-category/list/${mainCategoryId}`
  );
  const data = (await response.json()) as CommonResponseType<Category[]>;
  return data.result;
};

export const getProducts = async (params: {
  mainCategoryId: string;
  subCategoryId: string;
  sort: string;
  page: number;
  size: number;
}) => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/product-service/api/v1/products`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );
  const data = await response.json();
  return data.result;
};
