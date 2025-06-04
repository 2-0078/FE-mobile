import React from "react";
import Image from "next/image";

export default function ItemCardImage({
  remainingTime,
  thumbnail,
}: {
  remainingTime: string;
  thumbnail: string;
}) {
  return (
    <div className="relative w-full h-40 rounded-t-xl">
      <Image
        src={thumbnail}
        alt="artwork"
        fill={true}
        objectFit="cover"
        objectPosition="top"
      />
      <div className="absolute top-3 left-4 bg-black/15 backdrop-blur-sm text-xs px-3 py-1 rounded-lg shadow text-white">
        <p className="text-center">
          남은 시간
          <br />
          {remainingTime}
        </p>
      </div>
      <div className="absolute bottom-3 left-4 bg-custom-red text-white text-xs px-2 py-0.5 rounded shadow">
        Highest Bid
      </div>
    </div>
  );
}
