"use server";
import { auth } from "@/auth";
import { CommonResponseType } from "@/types/CommonTypes";

export const fundingParticipate = async (
  fundingUuid: string,
  quantity: number
) => {
  const session = await auth();
  const token = session?.user?.accessToken;
  console.log(token);
  const response = await fetch(
    `${process.env.BASE_API_URL}/funding-service/api/v1/participation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fundingUuid, quantity }),
    }
  );
  const data = (await response.json()) as CommonResponseType<any>;
  console.log(data);
  return data.result;
};

export const getFundingWish = async (fundingUuid: string) => {
  const session = await auth();
  const token = session?.user?.accessToken;
  console.log(token);
  const response = await fetch(
    `${process.env.BASE_API_URL}/funding-service/api/v1/funding/wish/${fundingUuid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = (await response.json()) as CommonResponseType<boolean>;
  console.log(data);
  return data.result;
};

export const fundingWish = async (fundingUuid: string) => {
  const session = await auth();
  const token = session?.user?.accessToken;
  const response = await fetch(
    `${process.env.BASE_API_URL}/funding-service/api/v1/funding/wish`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = (await response.json()) as CommonResponseType<any>;
  return data.result;
};
