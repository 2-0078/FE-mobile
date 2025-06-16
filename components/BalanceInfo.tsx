import { Button } from "@/components/ui/button";

interface BalanceInfoProps {
  depositBalance: number;
  reserveAmount: number;
}

export function BalanceInfo({
  depositBalance,
  reserveAmount,
}: BalanceInfoProps) {
  return (
    <>
      <div>
        <p className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">예치금 잔액</span>
          <span className="text-custom-green text-2xl font-bold">
            {depositBalance.toLocaleString()}원
          </span>
        </p>
        <Button className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-lg">
          예치금이 부족합니까?
        </Button>
      </div>

      <div className="text-center">
        <p className="text-gray-600 text-xs">매수 총액</p>
        <p className="text-black text-3xl font-bold mb-4">
          {reserveAmount.toLocaleString()}원
        </p>
      </div>
    </>
  );
}
