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
    <>
      {isLoggedIn ? (
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
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
      ) : (
        <Link href="/login" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-800 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center">
            <LogIn className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">로그인이 필요해요</p>
            <p className="text-green-400 font-medium">로그인하고 시작하기 →</p>
          </div>
        </Link>
      )}
    </>
  );
}
