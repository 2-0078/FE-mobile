<<<<<<< HEAD
import { getMemberProfile } from "@/action/member-service";
import { ReplyType } from "@/types/CommunityTypes";
import { useEffect, useState } from "react";
import Image from "next/image";
=======
import { ReplyTypeWithPeople } from '@/types/CommunityTypes';
import Image from 'next/image';
>>>>>>> feat/productsPage

export function CommentItem({
  createdAt,
  memberUuid,
  mine,
  replyContent,
}: ReplyType) {
  const [avatar, setAvatar] = useState<string>("/chatbot.png");
  const [username, setUsername] = useState<string | null>(null);
  console.log(mine);
  useEffect(() => {
    const fetchMemberProfile = async () => {
      const memberProfile = await getMemberProfile(memberUuid);
      setAvatar(memberProfile.profileImageUrl || "/chatbot.png");
      setUsername(memberProfile.nickname);
    };
    fetchMemberProfile();
  }, [memberUuid]);

  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg">
        {
          <Image
<<<<<<< HEAD
            src={avatar || "/chatbot.png"}
=======
            src={replyUserInfo.profileImageUrl || '/chatbot.png'}
>>>>>>> feat/productsPage
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
            <p className="font-medium text-xs text-black">{username}</p>
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
