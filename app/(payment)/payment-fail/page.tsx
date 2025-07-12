'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code');
  const message = searchParams.get('message') || '결제에 실패했습니다.';

  const handleRetryPayment = () => {
    router.push('/charge');
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 실패</h1>
          <p className="text-gray-600 mb-2">{message}</p>
          {code && (
            <p className="text-gray-500 text-sm mb-6">오류 코드: {code}</p>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleRetryPayment}
              className="w-full bg-custom-green text-black font-bold"
            >
              다시 시도하기
            </Button>
            <Button
              onClick={handleGoToHome}
              variant="outline"
              className="w-full"
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
