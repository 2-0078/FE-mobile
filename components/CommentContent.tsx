<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { ReplyType } from "@/types/CommunityTypes";
import { CommentItem } from "./CommentItem";

export function CommentsContent({ comments }: { comments: ReplyType[] }) {
=======
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
>>>>>>> feat/productsPage
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
