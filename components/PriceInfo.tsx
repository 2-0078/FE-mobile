interface PriceInfoProps {
  currentPrice: number;
  totalPieces: number;
  remainingPieces: number;
}

export function PriceInfo({
  currentPrice,
  totalPieces,
  remainingPieces,
}: PriceInfoProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-sm">조각 공모가</span>
        <span className="text-gray-600 text-sm">총조각/남은조각</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-black text-3xl font-bold">
          {currentPrice.toLocaleString()}
        </span>
        <span className="text-black text-xl">
          {totalPieces}/{remainingPieces}
        </span>
      </div>
    </div>
  );
}
