'use server';
import { auth } from '@/auth';
import { CommonResponseType } from '@/types/CommonTypes';
import { revalidateTag } from 'next/cache';

export const fundingParticipate = async (
  fundingUuid: string,
  quantity: number
) => {
  const session = await auth();
  const token = session?.user?.accessToken;
  const memberUuid = session?.user?.memberUuid;

  if (!token || !memberUuid) {
    throw new Error('로그인이 필요합니다.');
  }

  const response = await fetch(
    `${process.env.BASE_API_URL}/funding-service/api/v1/participation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Member-Uuid': memberUuid,
      },
      body: JSON.stringify({ fundingUuid, quantity }),
    }
  );
  const data = (await response.json()) as CommonResponseType<{
    result: unknown;
  }>;
  return data.result;
};

export const getFundingWish = async (fundingUuid: string) => {
  const session = await auth();

  // 로그인하지 않은 경우 false 반환
  if (!session?.user?.accessToken || !session?.user?.memberUuid) {
    return false;
  }

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}/funding-service/api/v1/funding/wish/${fundingUuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`,
          'X-Member-Uuid': session.user.memberUuid,
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as CommonResponseType<{
      result: boolean;
    }>;
    //console.log('getwishdata', data);
    return data.result;
  } catch (error) {
    console.error('Failed to get funding wish status:', error);
    return false;
  }
};

export const fundingWish = async (fundingUuid: string, productUuid: string) => {
  const session = await auth();
  const token = session?.user?.accessToken;
  const memberUuid = session?.user?.memberUuid;

  if (!token || !memberUuid) {
    return { error: '로그인이 필요합니다.' };
  }

  const response = await fetch(
    `${process.env.BASE_API_URL}/funding-service/api/v1/funding/wish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Member-Uuid': memberUuid,
      },
      body: JSON.stringify({
        productUuid: productUuid,
        fundingUuid: fundingUuid,
      }),
    }
  );
  //console.log('response', response);
  const data = (await response.json()) as CommonResponseType<{
    result: unknown;
  }>;
  //console.log('wishdata', data);

  // 정상적으로 좋아요 처리되면 revalidateTag 호출
  if (data.isSuccess) {
    revalidateTag('funding-wish');
  }

  return data.result;
};

interface WishRequest {
  productUuid: string;
  fundingUuid: string;
}

interface WishResponse {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: null;
}

export async function addToWishlist(
  request: WishRequest
): Promise<WishResponse> {
  try {
    const session = await auth();
    if (!session?.user?.accessToken || !session?.user?.memberUuid) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch(
      'https://api.pieceofcake.site/funding-service/api/v1/funding/wish',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`,
          'X-Member-Uuid': session.user.memberUuid,
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error('좋아요 요청에 실패했습니다.');
    }

    const data: WishResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    throw error;
  }
}
