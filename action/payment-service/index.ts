'use server';

import { auth } from '@/auth';
import {
  CommonResponseType,
  CreatePaymentRequest,
  CreatePaymentResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
} from '@/types/CommonTypes';

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

// 결제 생성 API
export async function createPayment(
  request: CreatePaymentRequest
): Promise<CreatePaymentResponse> {
  const session = await auth();
  if (!session?.user?.memberUuid) {
    throw new Error('로그인이 필요합니다.');
  }

  const { memberUuid } = session.user;
  const token = session?.user?.accessToken;

  const response = await fetch(
    `${process.env.BASE_API_URL}/payment-service/api/v1/payment/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Member-Uuid': memberUuid,
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error('결제 생성에 실패했습니다.');
  }

  return response.json();
}

// 결제 확인 API
export async function confirmPayment(
  request: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> {
  const session = await auth();
  if (!session?.user?.memberUuid) {
    throw new Error('로그인이 필요합니다.');
  }

  const { memberUuid } = session.user;
  const token = session?.user?.accessToken;

  const response = await fetch(
    `${process.env.BASE_API_URL}/payment-service/api/v1/payment/confirm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Member-Uuid': memberUuid,
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error('결제 확인에 실패했습니다.');
  }

  return response.json();
}

export const chargeMoney = async (amount: number) => {
  const session = await auth();
  const token = session?.user?.accessToken;

  const chargeData = {
    amount: amount,
    isPositive: true,
    historyType: 'DEPOSIT',
    moneyHistoryDetail: '충전',
    bankName: 'string',
    accountNumber: 'string',
    accountHolderName: 'string',
    paymentUuid: 'string',
    paymentTime: new Date().toISOString(),
    paymentMethod: 'string',
    paymentStatus: 'string',
  };

  const response = await fetch(
    `${process.env.BASE_API_URL}/payment-service/api/v1/money`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(chargeData),
    }
  );

  const data = (await response.json()) as CommonResponseType<any>;

  if (!data.isSuccess) {
    throw new Error(data.message || '충전에 실패했습니다.');
  }

  return data.result;
};
