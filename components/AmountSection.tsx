"use client";

import { useState } from "react";
import { NumberPad } from "./NumberPad";

export function AmountSection({ piecePrice }: { piecePrice: number }) {
  const [amount, setAmount] = useState("");

  const handleNumberClick = (num: string) => {
    // 최대 자릿수 제한 (예: 10자리)
    if (amount.length >= 10) return;

    setAmount((prev) => prev + num);
  };

  const handleDelete = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmount("");
  };

  return (
    <>
      <div className="text-center">
        <p className="text-gray-600 text-xs">매수 총액</p>
        <p className="text-black text-3xl font-semibold mb-4">
          {(Number(amount) * piecePrice).toLocaleString()}원
        </p>
      </div>
      <div className="px-6 mb-6">
        <div className="mb-4">
          <div className="text-gray-600 text-xs mb-1">구매 수량</div>
          <div className="flex items-center justify-between border-b border-gray-300 pb-2 h-10">
            <span className="text-black text-2xl font-bold">{amount}</span>
            <span className="text-custom-gray-200 text-md">개</span>
          </div>
        </div>
      </div>
      <NumberPad
        onNumberClick={handleNumberClick}
        onDelete={handleDelete}
        onClear={handleClear}
      />
    </>
  );
}
