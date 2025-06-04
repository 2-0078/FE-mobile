import React from "react";

export default function graphsection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <button className="bg-custom-green text-black font-medium rounded-full px-6">
          Expense
        </button>
      </div>
      <div className="relative h-48 mb-8">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <path
            d="M 20 150 Q 60 140 80 130 T 120 120 Q 160 110 200 80 Q 240 120 280 130 Q 320 140 380 135"
            stroke="#a855f7"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="200" cy="80" r="4" fill="#1f2937" />
          <line
            x1="200"
            y1="80"
            x2="200"
            y2="180"
            stroke="#1f2937"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        </svg>
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded text-sm font-medium">
          P5,567.00
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mb-8">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span className="font-medium text-black">May</span>
        <span>June</span>
        <span>July</span>
        <span>Aug</span>
      </div>
    </section>
  );
}
