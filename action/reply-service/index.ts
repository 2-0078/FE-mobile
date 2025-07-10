'use server';

import { auth } from '@/auth';
import { CommonResponseType } from '@/types/CommonTypes';
import { ReplyType, ReplyListItemType } from '@/types/CommunityTypes';

export async function getRepliesUuid(
  type: 'FUNDING' | 'PIECE',
  productUuid: string,
  commentPage: string
) {
  console.log(productUuid);
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

export async function getRepliesWithChildren(
  type: 'FUNDING' | 'PIECE',
  productUuid: string,
  commentPage: string
) {
  const session = await auth();
  const token = session?.user?.accessToken || null;
  const memberUuid = session?.user?.memberUuid || null;

  console.log('Fetching replies with children:', {
    type,
    productUuid,
    commentPage,
  });

  const queryParams = new URLSearchParams();
  queryParams.append('page', (Number(commentPage) - 1).toString());
  queryParams.append('size', '10');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (memberUuid) {
    headers['X-Member-Uuid'] = memberUuid;
  }

  // Step 1: Get reply UUID list with deleted status
  const response = await fetch(
    `${
      process.env.BASE_API_URL
    }/reply-service/api/v1/reply/list/${type}/${productUuid}?${queryParams.toString()}`,
    {
      method: 'GET',
      headers,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Get replies list API error:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(
      `댓글 조회에 실패했습니다. (${response.status}: ${errorText})`
    );
  }

  const listData = (await response.json()) as CommonResponseType<
    ReplyListItemType[]
  >;
  console.log('Get replies list success:', listData);

  if (!listData.result || listData.result.length === 0) {
    return [];
  }

  // Step 2: Get individual reply details with children
  const replyDetails = await Promise.all(
    listData.result.map(async (replyItem) => {
      try {
        const replyDetail = await getReplies(replyItem.replyUuid);

        // deleted 상태를 replyDetail에 추가
        if (replyDetail) {
          replyDetail.deleted = replyItem.deleted;
        }

        return replyDetail;
      } catch (error) {
        console.error(
          'Failed to fetch reply detail:',
          replyItem.replyUuid,
          error
        );
        return null;
      }
    })
  );

  // Filter out null results and return valid replies
  const validReplies = replyDetails.filter(
    (reply): reply is ReplyType => reply !== null
  );
  console.log('Final replies with children:', validReplies);

  return validReplies;
}

export async function getReplies(replyUuid: string) {
  const session = await auth();
  const token = session?.user?.accessToken || null;
  const memberUuid = session?.user?.memberUuid || null;

  console.log('Fetching reply detail:', replyUuid);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (memberUuid) {
    headers['X-Member-Uuid'] = memberUuid;
  }

  const response = await fetch(
    `${process.env.BASE_API_URL}/reply-service/api/v1/reply/community/${replyUuid}`,
    {
      method: 'GET',
      headers,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Get reply detail API error:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(
      `댓글 상세 조회에 실패했습니다. (${response.status}: ${errorText})`
    );
  }

  const data = (await response.json()) as CommonResponseType<ReplyType>;
  console.log('Get reply detail success:', data);

  // If the reply has child replies, fetch them
  if (data.result) {
    try {
      const childReplies = await getChildReplies(replyUuid);
      data.result.childReplies = childReplies || [];
    } catch (error) {
      console.error('Failed to fetch child replies for:', replyUuid, error);
      data.result.childReplies = [];
    }
  }

  return data.result;
}

export async function getChildReplies(parentReplyUuid: string) {
  const session = await auth();
  const token = session?.user?.accessToken || null;
  const memberUuid = session?.user?.memberUuid || null;

  console.log('Fetching child replies for:', parentReplyUuid);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  if (memberUuid) {
    headers['X-Member-Uuid'] = memberUuid;
  }

  const response = await fetch(
    `${process.env.BASE_API_URL}/reply-service/api/v1/reply/child/${parentReplyUuid}`,
    {
      method: 'GET',
      headers,
    }
  );

  console.log('Get child replies response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Get child replies API error:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(
      `대댓글 조회에 실패했습니다. (${response.status}: ${errorText})`
    );
  }

  const data = (await response.json()) as CommonResponseType<ReplyType[]>;
  console.log('Get child replies success:', data);
  return data.result;
}

export async function createReply({
  boardType,
  boardUuid,
  replyContent,
}: {
  boardType: 'FUNDING' | 'PIECE';
  boardUuid: string;
  replyContent: string;
}) {
  const session = await auth();
  const token = session?.user?.accessToken || null;

  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  const response = await fetch(
    `${process.env.BASE_API_URL}/reply-service/api/v1/reply`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        boardType,
        boardUuid,
        replyContent,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('댓글 작성에 실패했습니다.');
  }

  const data = (await response.json()) as CommonResponseType<ReplyType>;
  return data.result;
}

export async function createChildReply({
  parentReplyUuid,
  replyContent,
}: {
  parentReplyUuid: string;
  replyContent: string;
}) {
  const session = await auth();
  const token = session?.user?.accessToken || null;
  const memberUuid = session?.user?.memberUuid || null;

  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  if (!memberUuid) {
    throw new Error('회원 정보가 필요합니다.');
  }

  console.log('Creating child reply:', { parentReplyUuid, replyContent });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Member-Uuid': memberUuid,
  };

  const response = await fetch(
    `${process.env.BASE_API_URL}/reply-service/api/v1/reply/child/${parentReplyUuid}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        replyContent,
      }),
    }
  );

  console.log('Child reply response status:', response.status);
  console.log('Child reply response headers:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Child reply API error:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(
      `대댓글 작성에 실패했습니다. (${response.status}: ${errorText})`
    );
  }

  const data = (await response.json()) as CommonResponseType<ReplyType>;
  console.log('Child reply success:', data);
  return data.result;
}

export async function updateReply({
  replyUuid,
  replyContent,
}: {
  replyUuid: string;
  replyContent: string;
}) {
  const session = await auth();
  const token = session?.user?.accessToken || null;
  const memberUuid = session?.user?.memberUuid || null;

  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  if (!memberUuid) {
    throw new Error('회원 정보가 필요합니다.');
  }

  console.log('Updating reply:', { replyUuid, replyContent });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Member-Uuid': memberUuid,
  };

  const response = await fetch(
    `${process.env.BASE_API_URL}/reply-service/api/v1/reply/${replyUuid}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        replyContent,
      }),
    }
  );

  console.log('Update reply response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update reply API error:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(
      `댓글 수정에 실패했습니다. (${response.status}: ${errorText})`
    );
  }

  const data = (await response.json()) as CommonResponseType<ReplyType>;
  console.log('Update reply success:', data);
  return data.result;
}

export async function deleteReply(replyUuid: string) {
  const session = await auth();
  const token = session?.user?.accessToken || null;
  const memberUuid = session?.user?.memberUuid || null;

  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  if (!memberUuid) {
    throw new Error('회원 정보가 필요합니다.');
  }

  console.log('Deleting reply:', replyUuid);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Member-Uuid': memberUuid,
  };

  const response = await fetch(
    `${process.env.BASE_API_URL}/reply-service/api/v1/reply/${replyUuid}`,
    {
      method: 'DELETE',
      headers,
    }
  );

  console.log('Delete reply response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Delete reply API error:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(
      `댓글 삭제에 실패했습니다. (${response.status}: ${errorText})`
    );
  }

  return true;
}
