"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ModalHeaderProps {
  onClose?: () => void;
  children?: React.ReactNode;
}

export function ModalHeader({ onClose, children }: ModalHeaderProps) {
  return (
    <div className="bg-white sticky top-0 z-10">
      <div className="flex justify-center pt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-custom-slate text-white"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
      </div>

      {children}
    </div>
  );
}
