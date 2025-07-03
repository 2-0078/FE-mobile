import React from "react";
import StockItem from "./StockItem";

export default function StockItemSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-black">Accounts</h3>
        <button className="text-custom-gray-200">Show All</button>
      </div>
      <StockItem />
      <StockItem />
      <StockItem />
      <StockItem />
      <StockItem />
      <StockItem />
      <StockItem />
    </section>
  );
}
