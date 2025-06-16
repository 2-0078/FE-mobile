"use client";

import { useState } from "react";
import { NumberPad } from "./NumberPad";

export function AmountSection() {
  const [amount, setAmount] = useState("245");

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
      <div className="px-6 mb-6">
        <div className="mb-4">
          <div className="text-gray-600 text-xs mb-1">구매 수량</div>
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
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
