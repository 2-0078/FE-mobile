'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmPayment } from '@/action/payment-service';
import { useAlert } from '@/hooks/useAlert';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success, error: showError } = useAlert();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');

        if (!paymentKey || !orderId || !amount) {
          showError('결제 정보가 올바르지 않습니다.');
          router.push('/charge');
          return;
        }

        // 결제 확인 API 호출
        await confirmPayment({
          paymentType: 'CARD',
          orderId,
          paymentKey,
          amount: parseInt(amount),
        });

        setIsConfirmed(true);
        success('결제가 성공적으로 완료되었습니다!');
      } catch (err) {
        console.error('Payment confirmation failed:', err);
        showError('결제 확인에 실패했습니다.');
        router.push('/charge');
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, router, success, showError]);

  const handleGoToCharge = () => {
    router.push('/charge');
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-green mx-auto mb-4"></div>
          <p className="text-gray-600">결제를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 성공!</h1>
          <p className="text-gray-600 mb-6">
            {isConfirmed
              ? '결제가 성공적으로 완료되었습니다.'
              : '결제 확인 중 오류가 발생했습니다.'}
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleGoToCharge}
              className="w-full bg-custom-green text-black font-bold"
            >
              추가 충전하기
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
