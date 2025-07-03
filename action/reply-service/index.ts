'use server';

import { auth } from '@/auth';
import { CommonResponseType } from '@/types/CommonTypes';
import { ReplyType } from '@/types/CommunityTypes';

export async function getRepliesUuid(
  type: 'FUNDING' | 'PIECE',
  productUuid: string,
  commentPage: string
) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', (Number(commentPage) - 1).toString());
  const response = await fetch(
    `${
      process.env.BASE_API_URL
    }/reply-service/api/v1/reply/list/${type}/${productUuid}?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data = (await response.json()) as CommonResponseType<
    {
      replyUuid: string;
    }[]
  >;
  return data.result;
}

export async function getReplies(replyUuid: string) {
  const session = await auth();
  const token = session?.user?.accessToken || null;

  const response = await fetch(
    `${process.env.BASE_API_URL}/reply-service/api/v1/reply/community/${replyUuid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  const data = (await response.json()) as CommonResponseType<ReplyType>;
  return data.result;
}

export async function createReply(reply: ReplyType) {
  const session = await auth();
  const token = session?.user?.accessToken || null;

  const response = await fetch(
    `${process.env.BASE_API_URL}/reply-service/api/v1/reply/community`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reply),
    }
  );

  const data = (await response.json()) as CommonResponseType<ReplyType>;
  return data.result;
}
