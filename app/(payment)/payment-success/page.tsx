'use client';

import { confirmPayment } from '@/action/payment-service';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('결제를 처리하고 있습니다...');

  useEffect(() => {
    const confirm = async () => {
      const paymentKey = searchParams.get('paymentKey') || '';
      const orderId = searchParams.get('orderId') || '';
      const amount = searchParams.get('amount') || '0';
      const result = await confirmPayment(orderId, paymentKey, Number(amount));

      if (result) {
        setMessage(`결제가 성공적으로 완료되었습니다. 주문번호: ${result}`);
        // TODO: 사용자를 마이페이지나 다른 완료 페이지로 리디렉션할 수 있습니다.
        window.location.href = '/main';
      } else {
        setMessage(`결제 실패: ${result}`);
      }
    };

    confirm();
  }, [searchParams]);

  return (
    <div>
      <h1>결제 상태</h1>
      <p>{message}</p>
    </div>
  );
}
