"use server";
import { CommonResponseType } from "@/types/CommonTypes";
import { auth } from "@/auth";

export const getMemberBalance = async () => {
  const session = await auth();
  const token = session?.user?.accessToken;
  const response = await fetch(
    `${process.env.BASE_API_URL}/payment-service/api/v1/money`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = (await response.json()) as CommonResponseType<{
    amount: number;
  }>;
  return data.result;
};

export const chargeMoney = async (amount: number) => {
  const session = await auth();
  const token = session?.user?.accessToken;
  const response = await fetch(
    `${process.env.BASE_API_URL}/payment-service/api/v1/payment/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: Number(amount),
        orderName: `토스 충전 ${amount}원`,
      }),
    }
  );
  const data = (await response.json()) as CommonResponseType<{
    customerKey: string;
    orderId: string;
    amount: number;
  }>;
  return data.result;
};

export const confirmPayment = async (
  orderId: string,
  paymentKey: string,
  amount: number
) => {
  const session = await auth();
  const token = session?.user?.accessToken;
  const response = await fetch(
    `${process.env.BASE_API_URL}/payment-service/api/v1/payment/confirm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentType: "CARD",
        orderId,
        paymentKey,
        amount: Number(amount),
      }),
    }
  );
  const data = (await response.json()) as CommonResponseType<any>;
  return data.result;
};
