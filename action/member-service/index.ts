'use server';

import { CommonResponseType } from '@/types/CommonTypes';
import { UserInfoType } from '@/types/UserTypes';

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
