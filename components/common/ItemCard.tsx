import React from "react";
import ItemCardInfo from "@/components/common/ItemCardInfo";
import ItemCardImage from "@/components/common/ItemCardImage";

export default function ItemCard() {
  return (
    <div className="w-80 rounded-2xl shadow-lg bg-white overflow-hidden relative mx-auto items-center justify-center">
      <ItemCardImage
        remainingTime="18h : 32m : 04s"
        thumbnail="https://previews.123rf.com/images/adrian1991/adrian19912109/adrian1991210900001/174101000-%EB%B3%84%EC%9D%B4-%EB%B9%9B%EB%82%98%EB%8A%94-%EB%B0%A4-%EB%B9%88%EC%84%BC%ED%8A%B8-%EB%B0%98-%EA%B3%A0%ED%9D%90-%EA%B7%B8%EB%A6%BC.jpg"
      />
      <ItemCardInfo />
    </div>
  );
}
