import React from 'react';
import Image from 'next/image';

export default function MainProfile({
  userName,
  userImageUrl,
}: {
  userName?: string;
  userImageUrl?: string;
}) {
  return (
    <div className="flex items-center space-x-3 pt-8 pl-4">
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-custom-green">
        <Image
          src={userImageUrl || '/chatbot.png'}
          alt="프로필 이미지"
          fill={true}
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-xs text-custom-gray-200">Good Morning!</p>
        <p className="text-base font-semibold">{userName}</p>
      </div>
    </div>
  );
}
