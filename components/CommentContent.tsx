import React from 'react';
import { CommentItem } from '@/components/CommentItem';
import { ReplyType } from '@/types/CommunityTypes';

interface CommentContentProps {
  comments: ReplyType[];
  boardType?: 'FUNDING' | 'PIECE';
  boardUuid?: string;
}

export function CommentContent({
  comments,
  boardType,
  boardUuid,
}: CommentContentProps) {
  if (comments.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="text-gray-300 text-2xl mb-3">💬</div>
        <p className="text-gray-500 text-sm font-medium">
          아직 댓글이 없습니다
        </p>
        <p className="text-gray-400 text-xs mt-1">첫 번째 댓글을 남겨보세요</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {comments.map((comment) => (
        <CommentItem
          key={comment.replyUuid}
          {...comment}
          {...(boardType && boardUuid ? { boardType, boardUuid } : {})}
        />
      ))}
    </div>
  );
}
