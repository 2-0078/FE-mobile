"use client";
import React, { useState } from "react";

export default function TabLayout({
  tabs,
  children,
}: {
  tabs: string[];
  children: React.ReactNode[] | React.ReactNode;
}) {
  const [selectedTab, setSelectedTab] = useState(0);
  const onSelect = (idx: number) => {
    setSelectedTab(idx);
  };
  return (
    <>
      <div
        className="flex flex-nowrap overflow-x-auto border-b border-custom-gray-300 px-4"
        style={{
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab + idx}
            className={`py-2 w-[20vw] text-center ${selectedTab === idx ? "text-white border-b-2 border-white" : "text-custom-gray-200"}`}
            onClick={() => onSelect(idx)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="px-4 py-3 text-sm">
        {Array.isArray(children) ? children[selectedTab] : children}
      </div>
    </>
  );
}
