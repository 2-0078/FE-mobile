import ArrowBackIcon from "@/repo/ui/Icons/ArrowBackIcon";
import React from "react";

export default function BackButton() {
  return (
    <button className="bg-custom-slate rounded-full w-12 h-12">
      <ArrowBackIcon className="mx-auto" />
    </button>
  );
}
