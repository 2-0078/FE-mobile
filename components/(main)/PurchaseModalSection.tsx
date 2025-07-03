'use client';
import React, { useState } from 'react';
import { ModalContainer } from '../ModalContainer';
import { ModalHeader } from '../ModalHeader';
import { useModal } from '@/stores/modal-store';
import { NumberPad } from '../NumberPad';
import { Button } from '../ui/button';
// ANONYMOUS는 더 이상 필요하지 않을 수 있습니다. 고객의 실제 키를 사용하게 됩니다.
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
// import { chargeMoney } from '@/action/payment-service';

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
    // const result = await chargeMoney(Number(amount));
    // 아래는 실제 결제 연동 로직 예시입니다. 백엔드 연동 필요 시 chargeMoney 구현 필요
    const tossPayments = await loadTossPayments(
      'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'
    );
    // const payment = tossPayments.payment({ customerKey: result.customerKey });
    // 결제 요청 예시 (실제 연동 시 아래 코드 사용)
    // await payment.requestPayment({ ... });
    // 현재는 결제창을 띄우지 않습니다.
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
