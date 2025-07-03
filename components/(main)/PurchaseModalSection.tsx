'use client';
import React, { useState } from 'react';
import { ModalContainer } from '../ModalContainer';
import { ModalHeader } from '../ModalHeader';
import { useModal } from '@/stores/modal-store';
import { NumberPad } from '../NumberPad';
import { Button } from '../ui/button';
// ANONYMOUS는 더 이상 필요하지 않을 수 있습니다. 고객의 실제 키를 사용하게 됩니다.
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { chargeMoney } from '@/action/payment-service';

export default function PurchaseModalSection() {
  const { currentModal, closeModal } = useModal();
  const [amount, setAmount] = useState('');

  const handleNumberClick = (num: string) => {
    if (amount.length >= 10) return;
    if (Number(amount + num) === 0) {
      setAmount(num);
      return;
    }
    if (Number(amount) === 0) {
      setAmount(num);
      return;
    }
    setAmount((prev) => prev + num);
  };

  const handleDelete = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmount('');
  };

  const handleCharge = async () => {
    const result = await chargeMoney(Number(amount));

    // 1. 토스 페이먼츠 객체 로드
    const tossPayments = await loadTossPayments(
      'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'
    );
    const payment = tossPayments.payment({ customerKey: result.customerKey });

    // 2. 결제 요청
    // `chargeMoney` 와 같은 백엔드 함수는 결제 '승인' 단계에서 호출해야 합니다.
    // 여기서는 결제창을 띄우는 역할만 합니다.
    try {
      await payment.requestPayment({
        // '카드', '가상계좌' 등 결제 수단 선택
        method: 'CARD',
        amount: {
          value: Number(result.amount),
          currency: 'KRW',
        },
        orderId: result.orderId, // 주문 ID: 고유한 값으로 생성해야 합니다.
        orderName: `예치금 ${Number(amount).toLocaleString()}원 충전`, // 주문명
        customerName: '김토스',
        successUrl: `${window.location.origin}/payment-success`, // 결제 성공 시 리디렉션될 URL
        failUrl: `${window.location.origin}/payment-fail`, // 결제 실패 시 리디렉션될 URL
      });
    } catch (error) {
      // 결제 창을 띄우는 데 실패한 경우 (예: 네트워크 오류, 잘못된 설정 등)
      console.error('결제 요청에 실패했습니다:', error);
      alert('결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <ModalContainer
        isOpen={currentModal === 'purchase'}
        onClose={() => {
          setAmount('');
          closeModal();
        }}
      >
        {(handleClose: () => void) => (
          <>
            <ModalHeader onClose={handleClose}>
              <div className="px-6 pb-6">
                <h1 className="text-black text-lg font-bold">충전하기</h1>
                <p className="text-gray-600 text-sm">
                  충전할 금액을 입력해주세요
                </p>
              </div>
            </ModalHeader>

            {/* 충전 금액 표시 */}
            <div className="px-6 mb-6">
              <div className="text-center">
                <p className="text-gray-600 text-xs mb-2">충전 금액</p>
                <p className="text-black text-3xl font-semibold">
                  {Number(amount || 0).toLocaleString()}원
                </p>
              </div>
            </div>

            {/* 입력된 금액 표시 */}
            <div className="px-6 mb-6">
              <div className="mb-4">
                <div className="text-gray-600 text-xs mb-1">입력 금액</div>
                <div className="flex items-center justify-between border-b border-gray-300 pb-2 h-10">
                  <span className="text-black text-2xl font-bold">
                    {amount || '0'}
                  </span>
                  <span className="text-custom-gray-200 text-md">원</span>
                </div>
              </div>
            </div>

            <NumberPad
              onNumberClick={handleNumberClick}
              onDelete={handleDelete}
              onClear={handleClear}
            />

            {/* 충전하기 버튼 */}
            <div className="px-6 py-6">
              <Button
                className="w-full h-14 bg-custom-green text-black text-lg font-bold rounded-full"
                onClick={handleCharge}
                disabled={!amount || Number(amount) === 0}
              >
                충전하기
              </Button>
            </div>
          </>
        )}
      </ModalContainer>
    </>
  );
}
