import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function MainProfile({
  isLoggedIn,
  userName,
  userImageUrl,
}: {
  isLoggedIn: boolean;
  userName?: string;
  userImageUrl?: string;
}) {
  return (
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-custom-green">
            <Image
              src={userImageUrl || '/chatbot.png'}
              alt="프로필 이미지"
              fill={true}
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
