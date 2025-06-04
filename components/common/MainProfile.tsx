import React from "react";
import Image from "next/image";

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
      {isLoggedIn ? (
        <>
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={userImageUrl || ""}
              alt="프로필 이미지"
              fill={true}
              objectFit="cover"
            />
          </div>
          <div>
            <p className="text-xs text-custom-gray-200">Good Morning!</p>
            <p className="text-base font-semibold">{userName}</p>
          </div>
        </>
      ) : (
        <p className="text-base font-semibold">로그인을 해주세요!</p>
      )}
    </div>
  );
}
