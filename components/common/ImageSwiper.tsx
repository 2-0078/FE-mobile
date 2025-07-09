'use client';

import React from 'react';
import Image from 'next/image';
import Swiper from './Swiper';

interface ImageSwiperProps {
  images: Array<{
    imageUrl: string;
    isThumbnail?: boolean;
  }>;
  alt: string;
  className?: string;
}

export default function ImageSwiper({
  images,
  alt,
  className = '',
}: ImageSwiperProps) {
  const renderImage = (image: { imageUrl: string; isThumbnail?: boolean }) => (
    <div className="relative rounded-xl overflow-hidden w-full h-[50vh]">
      <Image
        src={image.imageUrl}
        alt={alt}
        fill={true}
        sizes="100vw"
        className="object-contain"
      />
    </div>
  );

  if (images.length === 0) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden w-full h-[50vh] bg-gray-200 flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500">이미지가 없습니다</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Swiper
        items={images}
        renderItem={renderImage}
        config={{
          autoPlayInterval: 5000,
          threshold: 0.3,
          gap: 0,
        }}
        showIndicators={images.length > 1}
        className="h-[50vh]"
      />
    </div>
  );
}
