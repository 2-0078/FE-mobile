import { MoreHorizontal, Trash2 } from "lucide-react";

interface CommentItemProps {
  id: string;
  avatar: string;
  username: string;
  timestamp: string;
  content: string;
}

export function CommentItem({
  avatar,
  username,
  timestamp,
  content,
}: CommentItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-lg">
        {avatar}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="font-medium text-xs text-black">{username}</p>
            <p className="text-custom-gray-200 text-[11px]">{timestamp}</p>
          </div>
        </div>
        <p className="text-black text-xs font-medium leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}
