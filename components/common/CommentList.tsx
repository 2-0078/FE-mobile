'use client';

import React, { useState, useEffect } from 'react';
import { CommentItem } from '@/components/CommentItem';
import { ReplyType } from '@/types/CommunityTypes';
import { getReplies } from '@/action/reply-service';

interface CommentListProps {
  boardType: 'FUNDING' | 'PIECE';
  boardUuid: string;
}

export default function CommentList({
  boardType,
  boardUuid,
}: CommentListProps) {
  const [comments, setComments] = useState<ReplyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const replies = await getReplies(boardUuid);
        setComments(Array.isArray(replies) ? replies : []);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
        setError('댓글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [boardUuid]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 text-sm">아직 댓글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {comments.map((comment) => (
        <CommentItem key={comment.replyUuid} {...comment} />
      ))}
    </div>
  );
}
