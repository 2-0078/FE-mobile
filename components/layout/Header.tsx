import React from "react";
import BackButton from "@/components/common/BackButton";
import TitleWrapper from "@/components/layout/TitleWrapper";
import AlertButton from "@/components/common/AlertButton";

export default function Header({
  title,
  isAlert = true,
  isBackButton = true,
}: {
  title?: string;
  isAlert?: boolean;
  isBackButton?: boolean;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      {isBackButton && <BackButton />}
      <TitleWrapper className="text-xl">{title}</TitleWrapper>
      {isAlert && <AlertButton isActive={true} />}
    </header>
  );
}
