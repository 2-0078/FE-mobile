"use client";
import ReactECharts from "echarts-for-react";
import { MyMoneyInfoType } from "@/types/UserTypes";
import { formatPrice } from "@/lib/tool";

export default function AssetPieChart({
  myMoneyInfo,
}: {
  myMoneyInfo: MyMoneyInfoType[];
}) {
  const colorList = ["#1e40af", "#0891b2", "#06b6d4", "#67e8f9", "#0ea5e9"];

  const option = {
    backgroundColor: "transparent",
    series: [
      {
        name: "자산 분포",
        type: "pie",
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#1f2937",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        data: myMoneyInfo.map((item, index) => ({
          value: item.amount,
          name: item.category,
          itemStyle: {
            color: colorList[index],
          },
        })),
      },
    ],
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl px-4 pt-2">
      <h3 className="text-white text-lg font-semibold text-center">
        내 자산 가치
      </h3>

      <div className="flex items-center h-50 text-center">
        {/* ECharts Pie Chart */}
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "60%" }}
          opts={{ renderer: "svg" }}
        />
        {/* Legend */}
        <div className="flex-1 space-y-3">
          {myMoneyInfo.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colorList[index] }}
                />
                <span className="text-gray-300 text-sm">{item.category}</span>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium">
                  {formatPrice(item.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
