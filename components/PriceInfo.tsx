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
    <div className="mb-2">
      <div className="flex items-center justify-between">
        <span className="text-custom-gray-200 text-xs">조각 공모가</span>
        <span className="text-custom-gray-200 text-xs">남은조각/총조각</span>
      </div>
      <p className="flex items-center justify-between">
        <span className="text-black text-3xl font-bold">
          {currentPrice.toLocaleString()}
        </span>
        <span className="text-black text-lg font-semibold">
          {remainingPieces}/
          <span className="text-black text-lg font-light">{totalPieces}</span>
        </span>
      </p>
    </div>
  );
}
