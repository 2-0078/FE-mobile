'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { ReplyType } from '@/types/CommunityTypes';
import {
  getRepliesWithChildren,
  revalidateRepliesCache,
} from '@/action/reply-service';
import { CommentItem } from '@/components/CommentItem';
import { sortCommentsByLatest } from '@/lib/comment-utils';

interface CommentListProps {
  type: 'FUNDING' | 'PIECE';
  productUuid: string;
  commentPage?: string;
}

export function CommentList({
  type,
  productUuid,
  commentPage = '1',
}: CommentListProps) {
  const [comments, setComments] = useState<ReplyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchComments = async () => {
    setLoading(true);
    try {
      // 컴포넌트가 마운트될 때 캐시를 무효화하여 최신 데이터를 가져옴
      await revalidateRepliesCache({
        boardType: type,
        boardUuid: productUuid,
      });

      const commentsData = await getRepliesWithChildren(
        type,
        productUuid,
        commentPage
      );

      // 댓글을 최신순으로 정렬
      const sortedComments = sortCommentsByLatest(commentsData || []);
      setComments(sortedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTransition(() => {
      fetchComments();
    });
  }, [type, productUuid, commentPage]);

  // 이벤트 리스너 제거 - CommentSection에서만 처리하도록 변경

  if (loading || isPending) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        댓글을 불러오는 중...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        아직 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.replyUuid}
          {...comment}
          boardType={type}
          boardUuid={productUuid}
        />
      ))}
    </div>
  );
}
