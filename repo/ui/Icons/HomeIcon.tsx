import React from "react";

export default function HomeIcon({ isActive = false }: { isActive?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <mask id="house-mask">
          {/* 전체 영역을 흰색으로 채움 (보이게 됨) */}
          <rect width="24" height="24" fill="white" />
          {/* 문 모양은 검은색으로 채워서 도려냄 */}
          <path d="M9.6 22.1V15.6H14.4V22.1" fill="black" />
        </mask>
      </defs>

      {/* 집 모양에 마스크를 적용함 */}
      <path
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        className={`${isActive ? "fill-white" : "fill-custom-gray-300"}`}
        mask="url(#house-mask)"
      />
    </svg>
  );
}
