'use server';

import { auth } from '@/auth';
import { CommonResponseType } from '@/types/CommonTypes';

// Piece 매수 주문 API
export async function placeBuyOrder(
  pieceUuid: string,
  quantity: number,
  price: number
) {
  const session = await auth();
  if (!session?.user?.memberUuid) {
    throw new Error('로그인이 필요합니다.');
  }

  const { memberUuid } = session.user;
  const token = session?.user?.accessToken;

  const response = await fetch('/api/trading/buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Member-Uuid': memberUuid,
    },
    body: JSON.stringify({
      pieceProductUuid: pieceUuid,
      registeredPrice: price,
      desiredQuantity: quantity,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '매수 주문에 실패했습니다.');
  }

  const data = (await response.json()) as CommonResponseType<any>;
  return data.result;
}

// Piece 매도 주문 API
export async function placeSellOrder(
  pieceUuid: string,
  quantity: number,
  price: number
) {
  const session = await auth();
  if (!session?.user?.memberUuid) {
    throw new Error('로그인이 필요합니다.');
  }

  const { memberUuid } = session.user;
  const token = session?.user?.accessToken;

  const response = await fetch('/api/trading/sell', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Member-Uuid': memberUuid,
    },
    body: JSON.stringify({
      pieceProductUuid: pieceUuid,
      registeredPrice: price,
      desiredQuantity: quantity,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '매도 주문에 실패했습니다.');
  }

  const data = (await response.json()) as CommonResponseType<any>;
  return data.result;
}

// 사용자의 Piece 보유 현황 조회 API
export async function getUserPieceHoldings(pieceUuid: string) {
  const session = await auth();
  if (!session?.user?.memberUuid) {
    return null; // 로그인하지 않은 경우 null 반환
  }

  const { memberUuid } = session.user;
  const token = session?.user?.accessToken;

  try {
    const response = await fetch(`/api/trading/holdings/${pieceUuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch user holdings:', response.status);
      return null;
    }

    const data = (await response.json()) as CommonResponseType<{
      quantity: number;
      averagePrice: number;
    }>;
    return data.result;
  } catch (error) {
    console.error('Error fetching user holdings:', error);
    return null;
  }
}

// 주문 내역 조회 API
export async function getOrderHistory(pieceUuid: string) {
  const session = await auth();
  if (!session?.user?.memberUuid) {
    return [];
  }

  const { memberUuid } = session.user;
  const token = session?.user?.accessToken;

  try {
    const response = await fetch(`/api/trading/orders/${pieceUuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch order history:', response.status);
      return [];
    }

    const data = (await response.json()) as CommonResponseType<
      Array<{
        orderId: string;
        type: 'buy' | 'sell';
        quantity: number;
        price: number;
        totalAmount: number;
        status: string;
        createdAt: string;
      }>
    >;
    return data.result || [];
  } catch (error) {
    console.error('Error fetching order history:', error);
    return [];
  }
}
