"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // 프로젝트의 Button 컴포넌트 경로

export default function PaymentFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리로부터 에러 메시지와 코드를 가져옵니다.
  const errorMessage = searchParams.get("message");
  const errorCode = searchParams.get("code");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-red-500 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mt-6">
          결제에 실패했습니다
        </h1>
        <p className="text-gray-600 mt-3">
          결제를 완료하는 중 문제가 발생했습니다.
        </p>

        {/* 토스페이먼츠가 제공하는 실패 사유를 표시 */}
        <div className="mt-8 text-left bg-red-50 p-4 rounded-lg">
          <p className="font-semibold text-red-800">실패 사유:</p>
          <p className="text-red-700">
            {errorMessage || "알 수 없는 오류가 발생했습니다."}
          </p>
          {errorCode && (
            <p className="text-xs text-red-600 mt-2">에러코드: {errorCode}</p>
          )}
        </div>

        {/* 사용자 행동 유도 버튼 */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.back()} // 이전 페이지(충전 모달이 있던)로 돌아가기
            className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            다시 시도
          </Button>
          <Button
            onClick={() => router.push("/")} // 메인 페이지로 이동
            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            홈으로 가기
          </Button>
        </div>
      </div>
    </div>
  );
}
