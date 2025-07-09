'use client';

import React, { useState, useEffect } from 'react';
import { ReplyType } from '@/types/CommunityTypes';
import { getRepliesWithChildren } from '@/action/reply-service';
import { CommentItem } from '@/components/CommentItem';

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

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const commentsData = await getRepliesWithChildren(
          type,
          productUuid,
          commentPage
        );
        setComments(commentsData || []);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [type, productUuid, commentPage]);

  if (loading) {
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
        <CommentItem key={comment.replyUuid} {...comment} />
      ))}
    </div>
  );
}
