import React from "react";
import ProductTitleWrapper from "@/components/layout/ProductTitleWrapper";
import RemainingPieces from "@/components/common/RemainingPieces";
import Price from "@/components/layout/Price";
export default function ItemCardInfo() {
  return (
    <div className="p-4">
      <ProductTitleWrapper>Girl with the Pearl Earring</ProductTitleWrapper>
      <RemainingPieces remainingPieces={1} totalPieces={100} />
      <Price price={15800000} />
    </div>
  );
}
