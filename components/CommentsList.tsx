import { CommentItem } from "./CommentItem";

interface Comment {
  id: string;
  avatar: string;
  username: string;
  timestamp: string;
  content: string;
}

interface CommentsListProps {
  comments: Comment[];
}

export function CommentsList({ comments }: CommentsListProps) {
  return (
    <div className="px-6 space-y-4 pb-10">
      {comments.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
