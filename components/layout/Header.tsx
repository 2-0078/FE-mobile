import React from "react";
import BackButton from "@/components/common/BackButton";
import TitleWrapper from "@/components/layout/TitleWrapper";
import AlertButton from "@/components/common/AlertButton";
import { cn } from "@/lib/utils";

export default function Header({
  title,
  isAlert = true,
  isBackButton = true,
  className,
}: {
  title?: string;
  isAlert?: boolean;
  isBackButton?: boolean;
  className?: string;
}) {
  return (
    <header className={cn("flex items-center justify-between", className)}>
      {isBackButton && <BackButton />}
      <TitleWrapper className="text-xl">{title}</TitleWrapper>
      {isAlert && <AlertButton isActive={true} />}
    </header>
  );
}
