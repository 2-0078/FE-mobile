import React from "react";
import BottomNavbar from "@/components/layout/BottomNavbar";
export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <BottomNavbar />
    </>
  );
}
