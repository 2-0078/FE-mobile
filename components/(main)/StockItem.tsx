import React from "react";

export default function StockItem() {
  return (
    <div className="flex items-center justify-between p-4 bg-custom-skyblue  rounded-xl">
      <div className="flex items-center gap-3">
        <div>
          <p className="font-medium text-black">Mariana Napolitani</p>
          <p className="text-sm text-custom-gray-200">
            Send Money • 25-12-2022 6:00pm
          </p>
        </div>
      </div>
      <span className="text-custom-light-blue font-semibold">-P66.02</span>
    </div>
  );
}
