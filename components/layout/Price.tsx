import React from "react";
import { cn } from "@/lib/utils";
export default function Price({
  price,
  className,
}: {
  price: number;
  className?: string;
}) {
  return (
    <span className={cn("text-xl font-bold text-black mt-2", className)}>
      {price.toLocaleString("ko-KR", {
        style: "currency",
        currency: "KRW",
      })}
    </span>
  );
}
