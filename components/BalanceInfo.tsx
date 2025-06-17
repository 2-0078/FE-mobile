import { Button } from "@/components/ui/button";

interface BalanceInfoProps {
  depositBalance: number;
}

export function BalanceInfo({ depositBalance }: BalanceInfoProps) {
  return (
    <>
      <div>
        <p className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">예치금 잔액</span>
          <span className="text-custom-green text-2xl font-bold">
            {depositBalance.toLocaleString()}원
          </span>
        </p>
        <Button className="w-full h-10 bg-black text-white rounded-full">
          예치금이 부족하신가요?
        </Button>
      </div>
    </>
  );
}
