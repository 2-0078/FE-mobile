'use server';

import { auth } from '@/auth';
import { CommonResponseType } from '@/types/CommonTypes';
import { UserInfoType, MyMoneyInfoType } from '@/types/UserTypes';

export async function getMemberProfile(memberUuid: string) {
  const response = await fetch(
    `${process.env.BASE_API_URL}/member-service/api/v1/profile-image?memberUuid=${memberUuid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data = (await response.json()) as CommonResponseType<UserInfoType>;
  return data.result;
}

export async function getMyMoneyInfo() {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }
  const response = await fetch(
    `${process.env.BASE_API_URL}/batch-service/api/v1/money`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
    }
  );
  const data = (await response.json()) as CommonResponseType<MyMoneyInfoType[]>;
  return data.result;
}
