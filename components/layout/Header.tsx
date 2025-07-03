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
    <header className={cn("grid grid-cols-3 items-center", className)}>
      <div className="justify-self-start">{isBackButton && <BackButton />}</div>
      <div className="justify-self-center">
        <TitleWrapper className="text-xl text-center">{title}</TitleWrapper>
      </div>
      <div className="justify-self-end">
        {isAlert && <AlertButton isActive={true} />}
      </div>
    </header>
  );
}
