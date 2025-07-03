import { ReplyTypeWithPeople } from '@/types/CommunityTypes';
import Image from 'next/image';

export function CommentItem({
  createdAt,
  memberUuid,
  mine,
  replyContent,
  replyUserInfo,
}: ReplyTypeWithPeople) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg">
        {
          <Image
            src={replyUserInfo.profileImageUrl || '/chatbot.png'}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        }
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="font-medium text-xs text-black">
              {replyUserInfo.nickname}
            </p>
            <p className="text-custom-gray-200 text-[11px]">{createdAt}</p>
          </div>
        </div>
        <p className="text-black text-xs font-medium leading-relaxed">
          {replyContent}
        </p>
      </div>
    </div>
  );
}
