import { Button } from '@/components/ui/button';
import { ReplyTypeWithPeople } from '@/types/CommunityTypes';
import { CommentItem } from './CommentItem';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

export function CommentsContent({
  comments,
}: {
  comments: ReplyTypeWithPeople[];
}) {
  const [comment, setComment] = useState('');
  const handleComment = () => {
    console.log(comment);
  };
  return (
    <>
      <div className="px-6 space-y-4 pb-10">
        {comments.map((comment) => (
          <CommentItem key={comment.replyUuid} {...comment} />
        ))}
      </div>
      {/* Bottom Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <Textarea
          placeholder="의견을 남겨보세요..."
          className="bg-white mb-3 text-black"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button
          className="w-full h-12 bg-black text-white rounded-lg"
          onClick={handleComment}
        >
          댓글 작성하기
        </Button>
      </div>
    </>
  );
}
