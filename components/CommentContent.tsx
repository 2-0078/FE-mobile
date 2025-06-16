import { Button } from "@/components/ui/button";
import { CommentsList } from "./CommentsList";

interface Comment {
  id: string;
  avatar: string;
  username: string;
  timestamp: string;
  content: string;
}

interface CommentsContentProps {
  comments: Comment[];
}

// 이 컴포넌트는 서버 컴포넌트로 유지됩니다
export function CommentsContent({ comments }: CommentsContentProps) {
  return (
    <>
      <CommentsList comments={comments} />

      {/* Bottom Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <Button className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-lg">
          댓글을 입력해 주세요
        </Button>
      </div>
    </>
  );
}
