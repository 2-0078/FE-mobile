import { cn } from "@/lib/utils";
import React from "react";

export default function TitleWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1 className={cn("font-bold text-3xl text-white break-words", className)}>
      {children}
    </h1>
  );
}
