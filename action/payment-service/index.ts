'use server';

import { auth } from '@/auth';
import { CommonResponseType } from '@/types/CommonTypes';

export const getMemberBalance = async () => {
  const session = await auth();
  const token = session?.user?.accessToken;
  const response = await fetch(
    `${process.env.BASE_API_URL}/payment-service/api/v1/money`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  const data = (await response.json()) as CommonResponseType<{
    amount: number;
  }>;
  return data.result;
};

export const confirmPayment = async (paymentData: any) => {
  const session = await auth();
  const token = session?.user?.accessToken;
  const response = await fetch(
    `${process.env.BASE_API_URL}/payment-service/api/v1/payment/confirm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    }
  );
  const data = (await response.json()) as CommonResponseType<any>;
  return data.result;
};
