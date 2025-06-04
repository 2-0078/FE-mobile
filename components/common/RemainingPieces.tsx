import React from "react";

export default function RemainingPieces({
  remainingPieces,
  totalPieces,
}: {
  remainingPieces: number;
  totalPieces: number;
}) {
  return (
    <div className="text-xs font-semibold text-custom-gray-200">
      남은 조각 {remainingPieces}/{totalPieces}
    </div>
  );
}
