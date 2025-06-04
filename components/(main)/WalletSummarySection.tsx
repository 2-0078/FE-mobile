import React from "react";
import InfoCardLayout from "../layout/InfoCardLayout";
import WalletIcon from "@/repo/ui/Icons/WalletIcon";
import Price from "../layout/Price";
import MoneyIcon from "@/repo/ui/Icons/MoneyIcon";

export default function WalletSummarySection() {
  return (
    <section className="flex px-6 mb-8 gap-4 h-16">
      <InfoCardLayout
        title="Total 매수"
        icon={
          <div className="w-8 h-8 border-custom-gray-100/50 border rounded-lg flex items-center justify-center">
            <WalletIcon />
          </div>
        }
        className=" rounded-2xl"
      >
        <Price price={1567000} className="text-white text-base font-semibold" />
      </InfoCardLayout>
      <InfoCardLayout
        title="Total 매도"
        icon={
          <div className="w-8 h-8 border-custom-gray-100/50 border rounded-lg flex items-center justify-center">
            <MoneyIcon />
          </div>
        }
        className=" rounded-2xl"
      >
        <Price price={4980113} className="text-white text-base font-semibold" />
      </InfoCardLayout>
    </section>
  );
}
