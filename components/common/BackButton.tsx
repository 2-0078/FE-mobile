"use client";
import ArrowBackIcon from "@/repo/ui/Icons/ArrowBackIcon";
import React from "react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      className="bg-custom-slate rounded-full w-12 h-12"
      onClick={() => router.back()}
    >
      <ArrowBackIcon className="mx-auto" />
    </button>
  );
}
