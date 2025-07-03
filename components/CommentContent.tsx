import React from 'react';
import { Button } from '@/components/ui/button';
import { CommentItem } from '@/components/CommentItem';
import { ReplyType } from '@/types/CommunityTypes';

interface CommentContentProps {
  comments: ReplyType[];
}

export function CommentContent({ comments }: CommentContentProps) {
  return (
    <>
      <div className="px-6 space-y-4 pb-10">
        {comments.map((comment) => (
          <CommentItem key={comment.replyUuid} {...comment} />
        ))}
      </div>
      {/* Bottom Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <Button className="w-full h-12 bg-black text-white rounded-lg">
          댓글 작성하기
        </Button>
      </div>
    </>
  );
}
